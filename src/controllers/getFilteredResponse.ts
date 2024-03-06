import { apiKey, baseApiUrl } from '../config';
import { applyQueryFilters } from '../helpers';
import { IFilteredRequest, IFilteredResponse, IFilteredUrlParams } from '../types';

const getFilteredResponse = async (req: IFilteredRequest, res: IFilteredResponse) => {
    try {
        let submissions

        if (req.query.filters) {
            // Exclude the limit, offset and filters from query params
            const { limit, offset, filters, ...queryParams } = req.query;
            const params = new URLSearchParams(queryParams as IFilteredUrlParams);
            const submissionsResponse = await fetch(`${baseApiUrl}/forms/${req.params.formId}/submissions?${params})}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`
                }
            })
            const submissionsToFilter = await submissionsResponse.json();
            submissions = applyQueryFilters(submissionsToFilter, { limit, offset, filters, ...queryParams })
        } else {

            const queryParams = new URLSearchParams(req.query as IFilteredUrlParams);
            const submissionsResponse = await fetch(`${baseApiUrl}/forms/${req.params.formId}/submissions?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`
                }
            })
            // To do: Handle situation where api return a 400 error inside a 200 response
            submissions = await submissionsResponse.json();
            
        }


        res.status(200).json(submissions);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ name: 'Api error', message: error?.message });
        } else {
            res.status(500).json({ name: 'Api error', message: 'An unknown error occurred.' });
        }
    }
}

export default getFilteredResponse;
