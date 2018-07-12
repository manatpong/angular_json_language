import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-choose-emoji-dialog',
    templateUrl: './debugging-clear-database.html',
    styleUrls: ['./debugging-clear-database.scss'],
})
export class DebuggingClearDatabaseComponent {

    constructor(
        public dialogRef: MatDialogRef<DebuggingClearDatabaseComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

}
