import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { TableColumn } from './data-table.types';

interface TestItem {
  id: number;
  name: string;
  email: string;
}

describe('DataTableComponent', () => {
  let component: DataTableComponent<TestItem>;
  let fixture: ComponentFixture<DataTableComponent<TestItem>>;

  const mockData: TestItem[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com' },
  ];

  const mockColumns: TableColumn<TestItem>[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent<TestItem>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('required inputs', () => {
    it('should have data input', () => {
      expect(component.data()).toEqual(mockData);
      expect(component.data().length).toBe(5);
    });

    it('should have columns input', () => {
      expect(component.columns()).toEqual(mockColumns);
      expect(component.columns().length).toBe(3);
    });
  });

  describe('default values', () => {
    it('should have 10 rows by default', () => {
      expect(component.rows()).toBe(10);
    });

    it('should have default rowsPerPageOptions', () => {
      expect(component.rowsPerPageOptions()).toEqual([10, 25, 50]);
    });

    it('should have paginator enabled by default', () => {
      expect(component.paginator()).toBe(true);
    });

    it('should have showCurrentPageReport enabled by default', () => {
      expect(component.showCurrentPageReport()).toBe(true);
    });

    it('should have lazy loading disabled by default', () => {
      expect(component.lazy()).toBe(false);
    });

    it('should have loading as false by default', () => {
      expect(component.loading()).toBe(false);
    });

    it('should have default empty message', () => {
      expect(component.emptyMessage()).toBe('No data found.');
    });

    it('should have rowHover enabled by default', () => {
      expect(component.rowHover()).toBe(true);
    });
  });

  describe('totalPages computed', () => {
    it('should calculate total pages correctly', () => {
      fixture.componentRef.setInput('rows', 2);
      fixture.detectChanges();
      expect(component.totalPages()).toBe(3);
    });

    it('should return 1 page for small data', () => {
      expect(component.totalPages()).toBe(1);
    });

    it('should use totalRecords in lazy mode', () => {
      fixture.componentRef.setInput('lazy', true);
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();
      expect(component.totalPages()).toBe(10);
    });
  });

  describe('paginatedData computed', () => {
    it('should return paginated data for first page', () => {
      fixture.componentRef.setInput('rows', 2);
      fixture.detectChanges();
      expect(component.paginatedData().length).toBe(2);
      expect(component.paginatedData()[0].id).toBe(1);
    });

    it('should return all data when no pagination needed', () => {
      expect(component.paginatedData().length).toBe(5);
    });

    it('should return raw data in lazy mode', () => {
      fixture.componentRef.setInput('lazy', true);
      fixture.detectChanges();
      expect(component.paginatedData()).toEqual(mockData);
    });
  });

  describe('displayedRecords computed', () => {
    it('should return correct range', () => {
      const displayed = component.displayedRecords();
      expect(displayed.first).toBe(1);
      expect(displayed.last).toBe(5);
      expect(displayed.total).toBe(5);
    });

    it('should return zeros for empty data', () => {
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      const displayed = component.displayedRecords();
      expect(displayed.first).toBe(0);
      expect(displayed.last).toBe(0);
      expect(displayed.total).toBe(0);
    });
  });

  describe('pageNumbers computed', () => {
    it('should return page numbers', () => {
      fixture.componentRef.setInput(
        'data',
        Array(100).fill({ id: 1, name: 'Test', email: 'test@example.com' })
      );
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      const pages = component.pageNumbers();
      expect(pages.length).toBeLessThanOrEqual(5);
      expect(pages[0]).toBe(0);
    });
  });

  describe('pagination methods', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('rows', 2);
      fixture.detectChanges();
    });

    it('should go to specific page', () => {
      component.goToPage(1);
      expect(component.currentPage()).toBe(1);
    });

    it('should not go to negative page', () => {
      component.goToPage(-1);
      expect(component.currentPage()).toBe(0);
    });

    it('should not go beyond total pages', () => {
      component.goToPage(10);
      expect(component.currentPage()).toBe(0);
    });

    it('should go to first page', () => {
      component.goToPage(2);
      component.goToFirstPage();
      expect(component.currentPage()).toBe(0);
    });

    it('should go to last page', () => {
      component.goToLastPage();
      expect(component.currentPage()).toBe(2);
    });

    it('should go to previous page', () => {
      component.goToPage(2);
      component.goToPreviousPage();
      expect(component.currentPage()).toBe(1);
    });

    it('should go to next page', () => {
      component.goToNextPage();
      expect(component.currentPage()).toBe(1);
    });
  });

  describe('onRowClick', () => {
    it('should emit rowClick event', () => {
      spyOn(component.rowClick, 'emit');
      component.onRowClick(mockData[0]);
      expect(component.rowClick.emit).toHaveBeenCalledWith(mockData[0]);
    });
  });

  describe('onRowsChange', () => {
    it('should update rows and reset to first page', () => {
      spyOn(component.pageChange, 'emit');
      component.goToPage(1);

      const event = { target: { value: '25' } } as unknown as Event;
      component.onRowsChange(event);

      expect(component.currentRows()).toBe(25);
      expect(component.currentPage()).toBe(0);
      expect(component.pageChange.emit).toHaveBeenCalled();
    });
  });

  describe('getCellValue', () => {
    it('should get simple field value', () => {
      const value = component.getCellValue(mockData[0], 'name');
      expect(value).toBe('John Doe');
    });

    it('should handle null values', () => {
      const item = {
        id: 1,
        name: null as unknown as string,
        email: 'test@example.com',
      };
      const value = component.getCellValue(item, 'name');
      expect(value).toBe('');
    });

    it('should handle nested paths', () => {
      const item = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        nested: { value: 'deep' },
      };
      const value = component.getCellValue(item as TestItem, 'nested.value');
      expect(value).toBe('deep');
    });
  });

  describe('lazy loading', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('lazy', true);
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();
    });

    it('should emit lazyLoad event on page change', () => {
      spyOn(component.lazyLoad, 'emit');
      component.goToNextPage();
      expect(component.lazyLoad.emit).toHaveBeenCalledWith({
        first: 10,
        rows: 10,
      });
    });

    it('should use totalRecords for total count', () => {
      expect(component.displayedRecords().total).toBe(100);
    });
  });
});
