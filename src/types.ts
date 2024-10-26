export type TBubbleItem = {
    id: number | string;
    label: string;
    value: string | number | void;
    callback?: void
}

export type TIdList = Array<number>;

export type TAnswers = {
    genres: TIdList;
    actors: TIdList;
    directors: TIdList;
};

export interface IBubbleData {
    id: number;
    name: string;
    relevence: number;
    value: string | number;
}

export interface IBubbleDataExtended extends IBubbleData {
    id: any;
    type: string;
    linkedMovieIds?: Array<number>;
    linkedGenreIds?: Array<number>;
    tmdbId: number;
    selected: boolean;
}

export type TQuestions = {
    genres: Array<IBubbleDataExtended>;
    actors: Array<IBubbleDataExtended>;
    directors: Array<IBubbleDataExtended>;
};

export interface IVisNode {
    id: number;
    label?: string;
    value?: number;
    color?: string;
    x?: number;
    y?: number;
    physics?: boolean;
}

export type TRecommendationItem = {
    adult: boolean;
    backdrop_path?: string | null;
    genre_ids?: Array<number> | null;
    id: number;
    original_language: string;
    original_title: string;
    overview?: string;
    popularity?: number;
    poster_path?: string | null;
    release_date?: string;
    title: string;
    video: boolean;
    vote_average?: number;
    vote_count?: number;
}
export type TRecommendationItems = {
    data: Array<TRecommendationItem> | null;
    error?: boolean | null;
    message?: string | null;
}