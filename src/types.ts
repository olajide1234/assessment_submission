import { Request, Response } from 'express';

type FilterClauseType = {
	id: string;
	condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
	value: number | string | TDateISO;
};

export type ResponseFiltersType = FilterClauseType[];
export interface IFilteredQueryParams {
    limit?: number;
    afterDate?: string;
    beforeDate?: string;
    offset?: number;
    status?: 'inProgress' | 'finished';
    includeEditLink?: boolean;
    sort?: 'asc' | 'desc';
    filters?: string;
}

export type IFilteredUrlParams = {formId: string}


type TYear         = `${number}${number}${number}${number}`;
type TMonth        = `${number}${number}`;
type TDay          = `${number}${number}`;
type THours        = `${number}${number}`;
type TMinutes      = `${number}${number}`;
type TSeconds      = `${number}${number}`;
type TMilliseconds = `${number}${number}${number}`;
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;
type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;
// Credit: https://gist.github.com/MrChocolatine/367fb2a35d02f6175cc8ccb3d3a20054
type TDateISO = `${TDateISODate}T${TDateISOTime}Z`;

interface IQuestions {
    id: string;
    name: string;
    type: string;
    value: string | number | TDateISO;
}
interface IResponses {
    submissionId: string;
    submissionTime: string;
    urlParameters: string[];
    quiz: unknown;
    lastUpdatedAt: string;
    documents: unknown[];
    calculations: unknown[];
    questions: IQuestions[];
}

export interface IFilteredResponseSuccess {
    pageCount: number;
    totalResponses: number;
    responses: IResponses[];
}

export type IFilteredResponseBody = IFilteredResponseSuccess | Error;

export type IFilteredRequest = Request<IFilteredUrlParams, IFilteredResponseBody, {}, IFilteredQueryParams>;
export type IFilteredResponse = Response<IFilteredResponseBody>;
