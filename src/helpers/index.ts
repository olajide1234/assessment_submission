import { IFilteredQueryParams, IFilteredResponseSuccess, ResponseFiltersType } from "../types";


export const applyQueryFilters = (submissions: IFilteredResponseSuccess, queryParams: IFilteredQueryParams) => {
    if (queryParams.filters && queryParams.filters.length > 0) {
        const filters: ResponseFiltersType = JSON.parse(queryParams.filters);
        const limit = queryParams.limit 
        const offset = queryParams.offset

        submissions.responses = submissions.responses.filter((submission) => {
            for (const filter of filters) {
                const question = submission.questions.find((question) => question.id === filter.id);
                if (!question) {
                    return false;
                }
                switch (filter.condition) {
                    case 'equals':
                        if (question.value !== filter.value) {
                            return false;
                        }
                        break;
                    case 'does_not_equal':
                        if (question.value === filter.value) {
                            return false;
                        }
                        break;
                    case 'greater_than':
                        // Handle null values for numeric comparisons
                        if (question.value === null && typeof filter.value === 'number') {
                            // Assume null value is zero
                            if (0 <= filter.value) {
                                return false;
                            }
                        }
                        if (typeof filter.value === 'number' && typeof question.value === 'number') {
                            if (question.value <= filter.value) {
                                return false;
                            }
                        }
                        if (typeof filter.value === 'string' && typeof question.value === 'string') {
                            if (isValidDate(question.value) && isValidDate(filter.value)) {
                                if (new Date(question.value).getTime() <= new Date(filter.value).getTime()) {
                                    return false;
                                }
                            } else {
                                throw new Error('Cannot use numeric comparison for non-numeric values');
                            }
                        }
                        break;
                    case 'less_than':
                        // Handle null values for numeric comparisons
                        if (question.value === null && typeof filter.value === 'number') {
                            // Assume null value is zero
                            if (0 >= filter.value) {
                                return false;
                            }
                        }
                        if (typeof filter.value === 'number' && typeof question.value === 'number') {
                            if (question.value >= filter.value) {
                                return false;
                            }
                        }
                        if (typeof filter.value === 'string' && typeof question.value === 'string') {
                            if (isValidDate(question.value) && isValidDate(filter.value)) {
                                if (new Date(question.value).getTime() >= new Date(filter.value).getTime()) {
                                    return false;
                                }
                            } else {
                                throw new Error('Cannot use numeric comparison for non-numeric values');
                            }
                        }
                        break;
                    default:
                        return false;
                }
            }
            return true;
        });

        // Paginate using limit and offset
        if (limit && offset) {
            submissions.responses = submissions.responses.slice(Number(offset), Number(offset) + Number(limit));
            submissions.pageCount = Math.ceil(submissions.responses.length / Number(limit));
            submissions.totalResponses = submissions.responses.length;
            return submissions;
        } else {
            submissions.pageCount = 1;
            submissions.totalResponses = submissions.responses.length;
            return submissions;
        }
    } else {
        return submissions;
    }
}

export const isValidDate = (input: string) => {
    try {
        new Date(input).toISOString()
        return true
    } catch (error) {
        return false
    }
}
