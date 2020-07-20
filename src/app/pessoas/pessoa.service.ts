import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Pessoa, Estado, Cidade } from '../core/model';

import { environment } from 'src/environments/environment';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoaUrl: string;
  cidadesUrl: string;
  estadosUrl: string;

  constructor(private http: HttpClient) {
    this.pessoaUrl = `${environment.apiUrl}/pessoas`;
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
    this.estadosUrl = `${environment.apiUrl}/estados`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoaUrl}`, { params})
      .toPromise()
      .then( response => {
        const resultado = {
          pessoas: response['content'],
          total: response['totalElements']
        };

        return resultado;
      });
  }

  listarTodas(): Promise<any> {

    return this.http.get(`${this.pessoaUrl}`)
      .toPromise()
      .then( response => response['content']);
  }

  excluir(codigo: number): Promise<void> {

    return this.http.delete(`${this.pessoaUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  atualizar(pessoa: any): Promise<void> {
    const ativo = pessoa.ativo ? true : false;
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoaUrl}/${pessoa.codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  atualizarPessoa(pessoa: Pessoa): Promise<Pessoa> {

    return this.http.put<Pessoa>(`${this.pessoaUrl}/${pessoa.codigo}`, pessoa)
      .toPromise()
      .then(response => response);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {

    return this.http.post<Pessoa>(`${this.pessoaUrl}`, pessoa)
      .toPromise()
      .then(response => response);
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {

    return this.http.get<Pessoa>(`${this.pessoaUrl}/${codigo}`)
      .toPromise()
      .then(response => response);
  }

  listarEstados(): Promise<Estado[]> {
    return this.http.get(this.estadosUrl).toPromise()
      .then(response => response as Estado[]);
  }

  pesquisarCidades(estado): Promise<Cidade[]> {
    let params = new HttpParams();
    params = params.set('estado', estado);
    return this.http.get(this.cidadesUrl, { params })
      .toPromise()
      .then(response => response as Cidade[]);
  }
}
