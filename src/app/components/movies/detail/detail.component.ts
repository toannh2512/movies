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
    setTimeout(() => {
      this.movieService.onShowMoviePage(false);
      this.onFetchMovieDetail();
    }, 0);
  }

  private onFetchMovieDetail() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => this.movieService.fetchMovieDetail(params.get('id')!))
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
    this.movieService.onShowMoviePage(true);
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
