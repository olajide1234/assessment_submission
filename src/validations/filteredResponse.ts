import Joi, { CustomHelpers } from 'joi';
import { isValidDate } from '../helpers';

export interface IFilteredRequestSchema {
    params: Joi.ObjectSchema<{
        formId: string;
    }>,
    query: Joi.ObjectSchema<{
        limit: number;
        afterDate: string;
        beforeDate: string;
        offset: number;
        status: string;
        includeEditLink: boolean;
        sort: string;
    }>,
}

const filtersShapeValidation = (value: string, helpers: CustomHelpers) => {
    try {
        const filters = JSON.parse(value); // Improvement: Maybe we can just parse once and attached the parsed value to the request object
        if (!Array.isArray(filters)) {
            return helpers.error('custom.array');
        }
        for (const filter of filters) {
            if (typeof filter !== 'object') {
                return helpers.error('custom.type');
            }
            if (Object.keys(filter).length !== 3) {
                return helpers.error('custom.keyLength');
            }
            const keys = Object.keys(filter);
            if (!(keys.includes('id') && keys.includes('condition') && keys.includes('value'))) {
                return helpers.error('custom.keys');
            }
            if (typeof filter['id'] !== 'string') {
                return helpers.error('custom.id');
            }

            if (!['equals', 'does_not_equal', 'greater_than', 'less_than'].includes(filter['condition'])) {
                return helpers.error('custom.condition')
            }
            if (typeof filter['value'] !== 'string' && typeof filter['value'] !== 'number' && !isValidDate(filter['value'])) {
                return helpers.error('custom.value')
            }
        }
        return value;
    } catch (error) {
        return helpers.error('custom.error');
    }

}

const filteredResponse = {
    params: Joi.object().keys({
        formId: Joi.string(),
    }),
    query: Joi.object().keys({
        limit: Joi.number().integer(),
        afterDate: Joi.string().isoDate(),
        beforeDate: Joi.string().isoDate(),
        offset: Joi.number().integer(),
        status: Joi.string().valid('inProgress', 'finished'),
        includeEditLink: Joi.boolean(),
        sort: Joi.string().valid('asc', 'desc'),
        filters: Joi.string().custom(filtersShapeValidation, 'Validates that the filter shapes are correct').messages({
            'custom.array': 'Filters must be an array',
            'custom.type': 'Each filter must be an object',
            'custom.keyLength': 'Each filter must have exactly 3 keys',
            'custom.keys': 'Filters must be an array of objects with id, condition and value keys',
            'custom.id': 'id key must be a string',
            'custom.condition': 'Condition key must be one of equals, does_not_equal, greater_than, less_than',
            'custom.value': 'Value key must be a string or number or ISO date string',
            'custom.error': 'An error occurred while validating filters'
        })
    }),
};

export default filteredResponse;
