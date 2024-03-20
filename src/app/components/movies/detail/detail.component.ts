import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { MovieDetail } from '../../../models/movie-detail.model';
import { MinutesToHoursPipe } from '../../../pipes/minutes-to-hours.pipe';
import { MillionCurrencyPipe } from '../../../pipes/million-currency.pipe';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MinutesToHoursPipe, MillionCurrencyPipe],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  protected movieDetail: Partial<MovieDetail> = {};

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute) {
    this.onFetchMovieDetail();
  }

  private onFetchMovieDetail() {
    this.movieService.movieId$.pipe(
      takeUntil(this.destroy$),
      switchMap(id => this.movieService.fetchMovieDetail(id))
    ).subscribe({
      next: movieDetail => {
        this.movieDetail = movieDetail;
      },
      error: () => {
        this.movieDetail = {};
      }
    });
  }

  protected goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
