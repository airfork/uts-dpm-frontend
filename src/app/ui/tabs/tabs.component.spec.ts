import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { Tab } from './tabs.types';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  const mockTabs: Tab[] = [
    { name: 'tab1', label: 'First Tab' },
    { name: 'tab2', label: 'Second Tab' },
    { name: 'tab3', label: 'Third Tab', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    // Set required inputs
    fixture.componentRef.setInput('tabs', mockTabs);
    fixture.componentRef.setInput('activeTab', 'tab1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('required inputs', () => {
    it('should have tabs input', () => {
      expect(component.tabs()).toEqual(mockTabs);
      expect(component.tabs().length).toBe(3);
    });

    it('should have activeTab input', () => {
      expect(component.activeTab()).toBe('tab1');
    });
  });

  describe('optional inputs', () => {
    it('should have md size by default', () => {
      expect(component.size()).toBe('md');
    });

    it('should have bordered variant by default', () => {
      expect(component.variant()).toBe('bordered');
    });

    it('should have Tabs as default ariaLabel', () => {
      expect(component.ariaLabel()).toBe('Tabs');
    });

    it('should have centered as false by default', () => {
      expect(component.centered()).toBe(false);
    });
  });

  describe('containerClasses computed', () => {
    it('should include base classes', () => {
      const classes = component.containerClasses();
      expect(classes).toContain('flex');
      expect(classes).toContain('gap-1');
    });

    it('should not include justify-center when not centered', () => {
      const classes = component.containerClasses();
      expect(classes).not.toContain('justify-center');
    });

    it('should include justify-center when centered', () => {
      fixture.componentRef.setInput('centered', true);
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('justify-center');
    });
  });

  describe('getTabClasses', () => {
    it('should include base classes for all tabs', () => {
      const classes = component.getTabClasses(mockTabs[0]);
      expect(classes).toContain('font-medium');
      expect(classes).toContain('transition-all');
      expect(classes).toContain('duration-200');
    });

    it('should include active classes for active tab', () => {
      const classes = component.getTabClasses(mockTabs[0]);
      expect(classes).toContain('border-primary-500');
      expect(classes).toContain('text-primary-600');
    });

    it('should include inactive classes for inactive tab', () => {
      const classes = component.getTabClasses(mockTabs[1]);
      expect(classes).toContain('border-transparent');
      expect(classes).toContain('text-neutral-600');
    });

    it('should include disabled classes for disabled tab', () => {
      const classes = component.getTabClasses(mockTabs[2]);
      expect(classes).toContain('opacity-50');
      expect(classes).toContain('cursor-not-allowed');
    });

    it('should include cursor-pointer for enabled tabs', () => {
      const classes = component.getTabClasses(mockTabs[0]);
      expect(classes).toContain('cursor-pointer');
    });
  });

  describe('size classes', () => {
    it('should apply sm size classes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      const classes = component.getTabClasses(mockTabs[0]);
      expect(classes).toContain('px-3');
      expect(classes).toContain('py-1.5');
      expect(classes).toContain('text-sm');
    });

    it('should apply md size classes', () => {
      const classes = component.getTabClasses(mockTabs[0]);
      expect(classes).toContain('px-4');
      expect(classes).toContain('py-2');
      expect(classes).toContain('text-base');
    });

    it('should apply lg size classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const classes = component.getTabClasses(mockTabs[0]);
      expect(classes).toContain('px-6');
      expect(classes).toContain('py-3');
      expect(classes).toContain('text-lg');
    });
  });

  describe('variant classes', () => {
    it('should apply lifted variant classes for active tab', () => {
      fixture.componentRef.setInput('variant', 'lifted');
      fixture.detectChanges();
      const classes = component.getTabClasses(mockTabs[0]);
      expect(classes).toContain('bg-base-100');
      expect(classes).toContain('rounded-t-lg');
    });

    it('should apply default variant classes for active tab', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();
      const classes = component.getTabClasses(mockTabs[0]);
      expect(classes).toContain('bg-primary-100');
      expect(classes).toContain('rounded-lg');
    });
  });

  describe('selectTab', () => {
    it('should change active tab', () => {
      component.selectTab('tab2');
      expect(component.activeTab()).toBe('tab2');
    });

    it('should emit tabChange event', () => {
      spyOn(component.tabChange, 'emit');
      component.selectTab('tab2');
      expect(component.tabChange.emit).toHaveBeenCalledWith('tab2');
    });

    it('should not change to disabled tab', () => {
      component.selectTab('tab3');
      expect(component.activeTab()).toBe('tab1');
    });

    it('should not emit tabChange for disabled tab', () => {
      spyOn(component.tabChange, 'emit');
      component.selectTab('tab3');
      expect(component.tabChange.emit).not.toHaveBeenCalled();
    });

    it('should not change to non-existent tab', () => {
      component.selectTab('nonexistent');
      expect(component.activeTab()).toBe('tab1');
    });
  });
});
