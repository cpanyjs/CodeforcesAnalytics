export type Rank =
  | 'legendary grandmaster'
  | 'international grandmaster'
  | 'grandmaster'
  | 'international master'
  | 'master'
  | 'candidate master'
  | 'expert'
  | 'specialist'
  | 'pupil'
  | 'newbie';

export class SolvedProblem {
  contest: string;
  id: string;
  time: Date;

  constructor(cont: string, prob: string, time: number) {
    this.contest = cont;
    this.id = cont + prob;
    this.time = new Date(time * 1000);
  }
}

export class User {
  cfids: string[];
  maxRating: number;
  maxRank: Rank;
  rating: number;
  rank: Rank;
  solved: SolvedProblem[] = [];

  constructor({ handle, maxRating, maxRank, rating, rank }) {
    this.cfids = [handle];
    this.maxRating = maxRating;
    this.maxRank = maxRank;
    this.rating = rating;
    this.rank = rank;
  }

  solve(probs: SolvedProblem[]) {
    const set: Set<string> = new Set(this.solved.map(prob => prob.id));
    for (const prob of probs) {
      const { id } = prob;
      if (set.has(id)) continue;
      set.add(id);
      this.solved.push(prob);
    }
  }

  parse() {
    this.solved.sort((a: SolvedProblem, b: SolvedProblem): number => {
      if (a.time < b.time) return 1;
      else if (a.time > b.time) return 0;
      else return -1;
    });
  }
}
