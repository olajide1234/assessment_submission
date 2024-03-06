import express from 'express';
import welcome from './welcome';
import { IFilteredQueryParams, IFilteredResponseBody, IFilteredUrlParams } from '../types';
import { getFilteredResponse } from '../controllers';
import { filteredResponse } from '../validations';
import { validate } from '../middlewares';

const router = express.Router();

router.use('/', welcome);
router.use<IFilteredUrlParams, IFilteredResponseBody, Record<string, never>, IFilteredQueryParams>('/:formId/filteredResponse', validate(filteredResponse), getFilteredResponse);

export default router;
