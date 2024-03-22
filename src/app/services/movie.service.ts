import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MovieDetail } from '../models/movie-detail.model';


@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private isShowMoviePageSubject = new BehaviorSubject<boolean>(true);
  public readonly isShowMoviePage$ = this.isShowMoviePageSubject.asObservable();

  constructor(private http: HttpClient) { }

  public fetchMovies() {
    return this.http
      .get<Movie[]>('/movies');
  }

  public fetchMovieDetail(id: string) {
    return this.http
      .get<MovieDetail>(`/movies/${id}`);
  }

  public onShowMoviePage(isShow: boolean) {
    this.isShowMoviePageSubject.next(isShow);
  }
}
