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

export type ParticipantType =
  | 'CONTESTANT'
  | 'PRACTICE'
  | 'VIRTUAL'
  | 'MANAGER'
  | 'OUT_OF_COMPETITION';

export class SolvedProblem {
  contest: string;
  id: string;
  time: Date;
  type: ParticipantType;

  constructor(cont: string, prob: string, time: number, tp: string) {
    this.contest = cont;
    this.id = cont + prob;
    this.time = new Date(time * 1000);
    this.type = tp as ParticipantType;
  }
}

interface BaseUser {
  cfids: string[];
  maxRating: number;
  maxRank: Rank;
  rating: number;
  rank: Rank;
  solved: SolvedProblem[];
}

export type OutputUser = BaseUser & {
  contest: string[];
  vp: string[];
  practice: string[];
};

export class User implements BaseUser {
  cfids: string[];
  maxRating: number;
  maxRank: Rank;
  rating: number;
  rank: Rank;
  solved: SolvedProblem[] = [];

  private solvedSet = new Set<string>();
  contest = new Set<string>();
  vp = new Set<string>();
  practice = new Set<string>();

  constructor({ handle, maxRating, maxRank, rating, rank }) {
    this.cfids = [handle];
    this.maxRating = maxRating;
    this.maxRank = maxRank;
    this.rating = rating;
    this.rank = rank;
  }

  solve(probs: SolvedProblem[]) {
    for (const prob of probs) {
      const { id, contest, type } = prob;
      if (type === 'CONTESTANT') this.contest.add(contest);
      else if (type === 'VIRTUAL') this.vp.add(contest);
      else if (type === 'PRACTICE') this.practice.add(contest);
      if (this.solvedSet.has(id)) continue;
      this.solvedSet.add(id);
      this.solved.push(prob);
    }
  }

  parse(): OutputUser {
    this.solved.sort((a: SolvedProblem, b: SolvedProblem): number => {
      if (a.time < b.time) return 1;
      else if (a.time > b.time) return 0;
      else return -1;
    });
    return {
      cfids: this.cfids,
      maxRating: this.maxRating,
      maxRank: this.maxRank,
      rating: this.rating,
      rank: this.rank,
      solved: this.solved,
      contest: [...this.contest],
      vp: [...this.vp],
      practice: [...this.practice]
    };
  }
}
