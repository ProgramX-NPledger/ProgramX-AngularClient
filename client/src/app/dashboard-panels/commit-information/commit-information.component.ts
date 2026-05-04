import {Component, OnInit, signal} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {BuildService} from '../../core/services/build-service.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-commit-information',
  imports: [
    AsyncPipe,
    NgIf,
    DatePipe
  ],
  templateUrl: './commit-information.component.html',
  standalone: true,
  styleUrl: './commit-information.component.css'
})

export class CommitInformationComponent implements OnInit {
  gitCommitHash: string | null = null;
  buildNumber: string | null = null;
  deployedAt: Date | null = null;
  isLoading = signal<boolean>(false);

  constructor(private buildService: BuildService) {

  }

  ngOnInit(): void {
   this.loadAndPopulateBuildInformation();
  }

  private loadAndPopulateBuildInformation() {
    this.isLoading.set(true);
    this.buildService.getServerBuildInformation().subscribe(
      {
        next: (serverBuildInformationResponse) => {
          this.isLoading.set(false);
          this.gitCommitHash = serverBuildInformationResponse.gitCommitHash;
          this.buildNumber = serverBuildInformationResponse.buildNumber;
          this.deployedAt = serverBuildInformationResponse.deployedAt;
        },
        error: (error) => {
          this.isLoading.set(false);
        }
      });
  }

  protected readonly environment = environment;
}
