import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import { Program } from '../models/program.model';

@Service()
export class ProgramService {
    private http = inject(HttpClient);

    getPrograms(): Observable<Program[]> {
        return this.http.get<Program[]>('/api/programs').pipe(
            retry(1),                         // transient network hiccup
            catchError(() => of([]))          // return empty list
        );
    }
}
