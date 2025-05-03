import { Injectable } from '@angular/core';
import { DpmService } from './dpm.service';
import { catchError, Observable, retry } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';
import ApprovalDpmPage from '../models/approval-dpm-page';

const BASE_URL = environment.baseUrl + '/dpms';

@Injectable({
  providedIn: 'root',
})
export class ApprovalsService {
  constructor(
    private dpmService: DpmService,
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  getApprovalDpms(page: number, size: number): Observable<ApprovalDpmPage> {
    return this.http.get<ApprovalDpmPage>(`${BASE_URL}/approvals?page=${page}&size=${size}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorService.errorResponse(
          error,
          'Something went wrong when trying to get the unapproved dpm list'
        );
      })
    );
  }

  updatePoints(id: number, points: number): Observable<unknown> {
    return this.http.patch<unknown>(`${BASE_URL}/${id}`, { points: points }).pipe(
      catchError((error) => {
        return this.errorService.errorResponse(
          error,
          "Something went wrong when trying to update the user's points"
        );
      })
    );
  }

  approveDpm(id: number): Observable<unknown> {
    return this.http.patch<unknown>(`${BASE_URL}/${id}`, { approved: true }).pipe(
      retry(2),
      catchError((error) => {
        return this.errorService.errorResponse(
          error,
          'Something went wrong trying to approve the dpm'
        );
      })
    );
  }

  denyDpm(id: number): Observable<unknown> {
    return this.http.patch<unknown>(`${BASE_URL}/${id}`, { ignored: true }).pipe(
      catchError((error) => {
        return this.errorService.errorResponse(
          error,
          'Something went wrong trying to deny the dpm'
        );
      })
    );
  }
}
