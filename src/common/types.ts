export interface SignUpInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginUpInput {
    email: string;
    password: string;
}

export interface CreateReviewInput {
    movieId: number,
    rating: number,
    comment: string
}

export interface CreateMovieInput {
    name: string,
    description: string,
    director: string,
    releaseDate: string
}
