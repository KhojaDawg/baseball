const given_names: string[] = [
	"Anatoli", "Bobson", "Darryl", "Dean", "Dwigt", "Glenallen", "Jeromy", "Karl", "Kevin", "Mario",
	"Mike", "Onson", "Raul", "Rey", "Scott", "Showne", "Sleve", "Tim", "Todd", "Tony", "Willie",
];
const family_names: string[] = [
	"Archideld", "Bonzalez", "Chamgerlain", "Dandleton", "Dourque", "Dugnutt", "Dustice",
	"Furcotte", "Gride", "McDichael", "Mcrlwain", "McSriff", "Mixon", "Nogilny", "Rortugal",
	"Sandaele", "Sernandez", "Smehrik", "Smorin", "Sweemey", "Truk", "Wesrey",
];


function random_int(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
}

function random_name(): string {
	const given_name = given_names[random_int(0, given_names.length - 1)];
	const family_name = family_names[random_int(0, family_names.length - 1)];
	return `${given_name} ${family_name}`;
}

export { random_int, random_name };
