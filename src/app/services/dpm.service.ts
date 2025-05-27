import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import PostDpmDto from '../models/post-dpm-dto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import HomeDpmDto from '../models/home-dpm-dto';
import DpmDetailPage from '../models/dpm-detail-page';
import { ErrorService } from './error.service';
import { DPMGroup } from '../models/dpm-type';
import { PutDpmGroup } from '../models/put-dpm-groups';
import { GetDpmColors } from '../models/get-dpm-colors';

const BASE_URL = environment.baseUrl + '/dpms';

@Injectable({
  providedIn: 'root',
})
export class DpmService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  getCurrentDpms(): Observable<HomeDpmDto[]> {
    return this.http.get<HomeDpmDto[]>(BASE_URL + '/current').pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        return this.errorService.errorResponse(
          error,
          "Something went wrong trying to get the user's current dpms"
        );
      })
    );
  }

  create(dpm: PostDpmDto): Observable<unknown> {
    return this.http.post(BASE_URL, dpm).pipe(
      catchError((error) => {
        return this.errorService.errorResponse(
          error,
          'Something went wrong trying to create the DPM'
        );
      })
    );
  }

  getAllForUser(id: string, page: number, size: number): Observable<DpmDetailPage> {
    return this.http.get<DpmDetailPage>(`${BASE_URL}/user/${id}?page=${page}&size=${size}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorService.errorResponse(
          error,
          "Something went wrong trying to get the user' dpms"
        );
      })
    );
  }

  getDpmGroups(): Observable<DPMGroup[]> {
    return this.http.get<DPMGroup[]>(`${BASE_URL}/list`).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorService.errorResponse(
          error,
          'Something went wrong trying to get the list of DPM types'
        );
      })
    );
  }

  getDpmColors(): Observable<GetDpmColors[]> {
    return this.http.get<GetDpmColors[]>(`${BASE_URL}/colors`).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorService.errorResponse(
          error,
          'Something went wrong trying to get the list of DPM colors'
        );
      })
    );
  }

  updateDpmGroups(groups: PutDpmGroup[]): Observable<unknown> {
    return this.http.put(BASE_URL + '/list', groups).pipe(
      catchError((error) => {
        return this.errorService.errorResponse(
          error,
          'Something went wrong trying to update the DPM types'
        );
      })
    );
  }
}
