import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MovieDetail } from '../models/movie-detail.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movieIdSubject = new BehaviorSubject<string>('');
  public readonly movieId$ = this.movieIdSubject.asObservable();

  constructor(private http: HttpClient) { }

  public fetchMovies() {
    return this.http
      .get<Movie[]>('/movies')
      .pipe(catchError(this.handleError));
  }

  public fetchMovieDetail(id: string) {
    return this.http
      .get<MovieDetail>(`/movies/${id}`)
      .pipe(catchError(this.handleError));
  }

  public selectMovieById(id: string) {
    this.movieIdSubject.next(id)
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
