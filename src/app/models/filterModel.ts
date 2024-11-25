interface SelectedFilter {
    id: number;
    name: string;
  }
  
export interface FilterModel {
    selectedAnswer: SelectedFilter;
    selectedDocument: SelectedFilter;
    selectedResult: number;
  }