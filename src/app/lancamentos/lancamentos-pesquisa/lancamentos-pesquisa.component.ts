import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent } from 'primeng/api/public_api';
import { ConfirmationService } from 'primeng/api';
import { ToastyService } from 'ng2-toasty';

import { LancamentoFiltro } from './../lancamento.service';
import { LancamentoService } from '../lancamento.service';
import { AuthService } from './../../seguranca/auth.service';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  lancamentos = [];
  @ViewChild('tabela', {static: true}) grid: any;

  constructor(
    private lancamentoService: LancamentoService,
    public auth: AuthService,
    private toasty: ToastyService,
    private confirmation: ConfirmationService,
    private errosHandler: ErrorHandlerService,
    private title: Title
    ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de Lançamentos');
    }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errosHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        this.grid.reset();

        this.toasty.success('Lançamento excluído com sucesso!');
      })
      .catch(erro => this.errosHandler.handle(erro));
  }
}
