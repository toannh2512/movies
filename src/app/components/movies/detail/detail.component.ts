import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { Subject, takeUntil } from 'rxjs';
import { MovieDetail } from '../../../models/movie-detail.model';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  protected movieDetail: MovieDetail | undefined;

  constructor(private movieService: MovieService) {
    this.onFetchMovieDetail();
  }

  private onFetchMovieDetail() {
    this.movieService.fetchMovieDetail(1).pipe(takeUntil(this.destroy$)).subscribe({
      next: movieDetail => {
        this.movieDetail = movieDetail;
      },
      error: () => {
        this.movieDetail = undefined;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
