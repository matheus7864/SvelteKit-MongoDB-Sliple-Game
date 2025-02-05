import dayjs from 'dayjs';
import words from '$lib/assets/words.json';
import { DAILY_LEVEL_SALT } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { shufflingGenerator } from '$lib/services/generator/strategies/shuffling';
import { analyzePuzzle } from '$lib/services/generator/analyze';

export const load = async () => {
	const date = dayjs().format('YYYY-MM-DD');

	// use current date + a secret value to determine the seed.
	// that way you can't easily generate the same level manually.
	const seed = date + DAILY_LEVEL_SALT;

	try {
		const puzzle = shufflingGenerator.generate(seed, { words, maxLength: 7, minLength: 6 });
		puzzle.id = `daily-${date}`;

		return {
			puzzle,
			analysis: analyzePuzzle(puzzle)
		};
	} catch (err: any) {
		error(500, err?.message ?? 'unknown error');
	}
};
