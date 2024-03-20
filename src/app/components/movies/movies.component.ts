import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnDestroy {
  protected movies: Movie[] = [];

  private destroy$ = new Subject<void>();

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute) {
    this.onFetchMovies();
  }

  protected onShowMovieDetail(movieId: number) {
    this.router.navigate(['detail'], { relativeTo: this.route })
  }

  private onFetchMovies() {
    this.movieService.fetchMovies().pipe(takeUntil(this.destroy$)).subscribe({
      next: movies => {
        this.movies = movies;
      },
      error: () => {
        this.movies = [];
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
