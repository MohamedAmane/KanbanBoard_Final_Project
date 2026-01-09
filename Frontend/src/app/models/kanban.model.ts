export interface Tag {
  id?: number;
  nom: string;
  couleur: string;
}

export interface Task {
  id?: number;
  titre: string;
  description: string;
  tags?: Tag[];
}

export interface Column {
  id?: number;
  nom: string;
  taches?: Task[];
  color?: string;
  currentPage?: number;
  totalPages?: number;
  isLoading?: boolean;
}

export interface Board {
  id?: number;
  nom: string;
  colonnes?: Column[];
}
