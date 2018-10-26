export let ID_FIELD = "id";

export const generateId = (length = 8) => {
    let result = ''
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (let i = length; i > 0; i -= 1) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
}

export const createNewOptimisticResponse = ({ operation, type, fields }) => {
    const optimisticResponse = {
        __typename: 'Mutation',
    }

    optimisticResponse[operation] = {
        __typename: type,
        ...fields,
        version: 1
    };
    optimisticResponse[operation][ID_FIELD] = - generateId();
    return optimisticResponse;
}