import { NextFunction } from 'express';
import { IFilteredRequest, IFilteredResponse } from '../types';
import { IFilteredRequestSchema } from '../validations/filteredResponse';

const validate = (schema: IFilteredRequestSchema) => (req: IFilteredRequest, res: IFilteredResponse, next: NextFunction) => {
    // Validate URL params
    const { error } = schema.params.validate(req.params);
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return res.status(400).json({ name: 'URL param validation error', message: errorMessage });
    }

    // Validate query params
    const { error: queryError } = schema.query.validate(req.query);

    if (queryError) {
      const errorMessage = queryError.details.map((details) => details.message).join(', ');
      return res.status(400).json({ name: 'Query param validation error', message: errorMessage });
    }

    return next();
  };
  
export default validate;
