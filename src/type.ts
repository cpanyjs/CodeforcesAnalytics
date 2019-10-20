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

export type SolvedProblem = {
  id: string;
  time: Date;
};

export class User {
  cfids: string[];
  maxRating: number;
  maxRank: Rank;
  rating: number;
  rank: Rank;
  solved: SolvedProblem[] = [];

  private solvedSet = new Set<string>();

  constructor({ handle, maxRating, maxRank, rating, rank }) {
    this.cfids = [handle];
    this.maxRating = maxRating;
    this.maxRank = maxRank;
    this.rating = rating;
    this.rank = rank;
  }

  solve(id: string, time: string): boolean {
    if (this.solvedSet.has(id)) return false;
    this.solvedSet.add(id);
    this.solved.push({
      id,
      time: new Date(time)
    });
    return true;
  }
}
