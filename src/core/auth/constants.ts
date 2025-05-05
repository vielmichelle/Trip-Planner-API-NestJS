// TODO: Move inside environment variables
export const jwtConstants = {
    secret: `cW4e3PRTeXclQD7f8FRg6RyDAd4JWFmmiRupu1zi9UTdheas5C`
};

export const jwtConfiguration = {
    secret: jwtConstants.secret,
    signOptions: {
        expiresIn: '1h'
    }
};