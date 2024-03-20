import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { Subject, combineLatest, debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MinutesToHoursPipe } from '../../pipes/minutes-to-hours.pipe';
import { MillionCurrencyPipe } from '../../pipes/million-currency.pipe';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule, MinutesToHoursPipe, MillionCurrencyPipe],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private movieId: string = '';
  private fullMovies: Movie[] = [];

  protected titleControl = new FormControl('', { nonNullable: true });
  protected dateControl = new FormControl('', { nonNullable: true });
  protected filteredMovies: Movie[] = [];
  protected shouldShowContent: boolean = true

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute) {
    this.onFetchMovies();
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      this.shouldShowContent = !event.urlAfterRedirects.includes(`/movies/${this.movieId}`);
    });

    combineLatest([
      this.titleControl.valueChanges.pipe(debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
        takeUntil(this.destroy$)),
      this.dateControl.valueChanges.pipe(debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
        takeUntil(this.destroy$))
    ]).pipe(
      map(([titleText, dateText]) => ({ titleText, dateText }))
    ).subscribe(({ titleText, dateText }) => {
      this.onFilterMovies(titleText, dateText);
    });
  }

  private onFilterMovies(title: string, year: string) {
    this.filteredMovies = this.fullMovies.filter(movie => {
      const titleMatch = movie.title.toLowerCase().includes(title.toLowerCase());
      const dateMatch = year ? movie.release_date.includes(year) : true;
      return titleMatch && dateMatch;
    });
  }

  protected onShowMovieDetail(movieId: string) {
    this.movieId = movieId;
    this.movieService.selectMovieById(movieId);
    this.router.navigate([movieId], { relativeTo: this.route });
  }

  private onFetchMovies() {
    this.movieService.fetchMovies().pipe(takeUntil(this.destroy$)).subscribe({
      next: movies => {
        this.fullMovies = movies;
        this.filteredMovies = movies;
      },
      error: () => {
        this.fullMovies = [];
        this.filteredMovies = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
