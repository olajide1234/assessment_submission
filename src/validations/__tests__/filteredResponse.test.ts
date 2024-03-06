import Joi from "joi";
import filteredResponse from "../filteredResponse";

describe('Filtered response validations', () => {
    it('should return incorrect param not allowed', () => {
        const errorResponse = filteredResponse.params.validate({form: 1234});
        expect(errorResponse['error']).toEqual(new Joi.ValidationError('"form" is not allowed', [], {"form": 1234}));
    });
    it('should return incorrect param invalid type', () => {
        const errorResponse = filteredResponse.params.validate({formId: 1234});
        expect(errorResponse['error']).toEqual(new Joi.ValidationError('"formId" must be a string', [], {"formId": 1234}));
    });

    it('should return param is valid', () => {
        expect(filteredResponse.params.validate({formId: 'string'})).toEqual({"value": {"formId": "string"}});
    });
    it('should return incorrect query limit', () => {
        const errorResponse = filteredResponse.params.validate({limit: 'string'});
        expect(errorResponse['error']).toEqual(new Joi.ValidationError('"limit" is not allowed', [], {"limit": "string"}));
    });
    it('should return incorrect query filters', () => {
        const errorResponse = filteredResponse.params.validate({filters: 'string'});
        expect(errorResponse['error']).toEqual(new Joi.ValidationError('"filters" is not allowed', [], {"filters": "string"}));
    });
// And more tests as necessary ...
});
