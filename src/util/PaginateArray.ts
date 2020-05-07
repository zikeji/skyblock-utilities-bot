export class PaginateArray {
    private readonly array: [];
    private readonly pageSize: number;

    public pageNumber: number = 1;
    public readonly pageCount: number;

    constructor(array: any, pageSize: number, pageNumber: number) {
        this.array = array;
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
        this.pageCount = Math.ceil(this.array.length / this.pageSize);
    }

    private getPage<T>(): T[] {
        return this.array.slice((this.pageNumber - 1) * this.pageSize, this.pageNumber * this.pageSize);
    }
    public currentPage<T>(): T[] {
        return this.getPage();
    }

    public first() {
        this.pageNumber = 1;
    }

    public previous() {
        this.pageNumber -= 1;
        if (this.pageNumber < 1) {
            this.pageNumber = this.pageCount;
        }
    }

    public next() {
        this.pageNumber += 1;
        if (this.pageNumber > this.pageCount) {
            this.pageNumber = 1;
        }
    }

    public last() {
        this.pageNumber = this.pageCount;
    }
}
