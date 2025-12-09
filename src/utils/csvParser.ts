export interface Exercise {
    day: string;
    exercise: string;
    sets: string;
    reps: string;
    rest: string;
    notes: string;
}

export type Routine = Record<string, Exercise[]>;

export const parseRoutineCSV = (csvText: string): Routine => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const routine: Routine = {};

    // Map header names to property keys
    const headerMap: Record<string, keyof Exercise> = {
        'dia': 'day',
        'ejercicio': 'exercise',
        'series': 'sets',
        'repeticiones': 'reps',
        'reps': 'reps', // Add support for 'reps'
        'descanso': 'rest',
        'notas': 'notes',
    };

    const indices: Record<string, number> = {};
    headers.forEach((h, i) => {
        // Remove quotes if present
        const cleanHeader = h.replace(/^"|"$/g, '');
        if (headerMap[cleanHeader]) {
            indices[headerMap[cleanHeader]] = i;
        }
    });

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV split handling quotes (basic implementation)
        // For this use case, we might assume simple CSV or use a regex if needed.
        // Let's use a regex to handle commas inside quotes.
        const row = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

        // Fallback if regex fails or simple split is enough (often Google Sheets exports are simple)
        // Actually, a simple split might break if there are commas in notes. 
        // Let's use a slightly more robust regex split.
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        if (values.length < Object.keys(indices).length) continue;

        const exercise: any = {};
        let hasData = false;

        Object.entries(indices).forEach(([key, index]) => {
            let value = values[index]?.trim() || '';
            // Remove surrounding quotes
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            // Replace double quotes with single quotes
            value = value.replace(/""/g, '"');

            exercise[key] = value;
            if (value) hasData = true;
        });

        if (hasData && exercise.day) {
            if (!routine[exercise.day]) {
                routine[exercise.day] = [];
            }
            routine[exercise.day].push(exercise as Exercise);
        }
    }

    return routine;
};
