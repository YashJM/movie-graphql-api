import { GraphQLError } from "graphql";

export const validateSignUpInput = (email: string, password: string): void => {
    const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail: boolean = emailExpression.test(String(email).toLowerCase())

    if (!isValidEmail) {
        throw new GraphQLError('Invalid Email format.', {
            extensions: { code: 'INPUT_VALIDATION_ERROR' },
        });
    }

    if (password.length < 8) {
        throw new GraphQLError('Password should be minimum 8 characters.', {
            extensions: { code: 'INPUT_VALIDATION_ERROR' },
        });
    }
};  
