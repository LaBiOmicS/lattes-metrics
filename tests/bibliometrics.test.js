'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { bibliometrics } = require('./helpers/load');

const bio = bibliometrics();

test('normalizarIssn', async (t) => {
    await t.test('mantem 8 digitos sem traco', () => {
        assert.equal(bio.normalizarIssn('00280836'), '00280836');
    });

    await t.test('remove hifen', () => {
        assert.equal(bio.normalizarIssn('0028-0836'), '00280836');
    });

    await t.test('preserva digito verificador X em maiuscula', () => {
        assert.equal(bio.normalizarIssn('2161-783x'), '2161783X');
        assert.equal(bio.normalizarIssn('2161783X'), '2161783X');
    });

    await t.test('remove espacos e caracteres estranhos', () => {
        assert.equal(bio.normalizarIssn('  0028 - 0836  '), '00280836');
    });

    await t.test('tamanho invalido devolve string vazia', () => {
        assert.equal(bio.normalizarIssn('123'), '');
        assert.equal(bio.normalizarIssn(''), '');
        assert.equal(bio.normalizarIssn(null), '');
    });
});

test('normalizarTitulo', async (t) => {
    await t.test('remove acentos, pontuacao e caixa', () => {
        assert.equal(bio.normalizarTitulo('Ciência & Saúde Coletiva'), 'ciencia saude coletiva');
        assert.equal(bio.normalizarTitulo('Biochimica et Biophysica Acta (BBA) - General Subjects'), 'biochimica et biophysica acta bba general subjects');
    });

    await t.test('colapsa espacos', () => {
        assert.equal(bio.normalizarTitulo('  Nature   Communications  '), 'nature communications');
    });
});

test('lookup de periodicos', async (t) => {
    await t.test('encontra Nature por ISSN', () => {
        const res = bio.lookup('0028-0836');
        assert.ok(res);
        assert.equal(res.journalName, 'Nature');
        assert.equal(res.qualis, 'A1');
        assert.equal(res.quartil, 'Q1');
        assert.equal(res.jcr, 50.5);
    });

    await t.test('encontra Games for Health Journal por ISSN com X', () => {
        const res = bio.lookup('2161-783X');
        assert.ok(res);
        assert.equal(res.journalName, 'Games for Health Journal');
        assert.equal(res.qualis, 'A1');
        assert.equal(res.quartil, 'Q1');
    });

    await t.test('encontra por titulo aproximado quando sem ISSN', () => {
        const res = bio.lookup(null, 'Scientific Reports');
        assert.ok(res);
        assert.equal(res.qualis, 'A1');
        assert.equal(res.quartil, 'Q1');
    });

    await t.test('periodico desconhecido devolve null', () => {
        assert.equal(bio.lookup('9999-9999', 'Revista Inexistente 12345'), null);
    });
});

test('pontuacao e cores Qualis / Quartil', async (t) => {
    await t.test('pontuacao Qualis', () => {
        assert.equal(bio.qualisPontos('A1'), 100);
        assert.equal(bio.qualisPontos('A2'), 85);
        assert.equal(bio.qualisPontos('A3'), 70);
        assert.equal(bio.qualisPontos('A4'), 55);
        assert.equal(bio.qualisPontos('B1'), 40);
        assert.equal(bio.qualisPontos('B4'), 5);
        assert.equal(bio.qualisPontos('C'), 0);
        assert.equal(bio.qualisPontos('NC'), 0);
        assert.equal(bio.qualisPontos(null), 0);
    });

    await t.test('cores amigaveis', () => {
        assert.ok(bio.qualisCor('A1').startsWith('#'));
        assert.ok(bio.quartilCor('Q1').startsWith('#'));
        assert.equal(bio.quartilCor('none'), '#888888');
    });

    await t.test('estimativa por JCR', () => {
        const a1 = bio.estimarPorJcr(5.2);
        assert.equal(a1.qualis, 'A1');
        assert.equal(a1.quartil, 'Q1');
        assert.equal(a1.estimado, true);

        const a2 = bio.estimarPorJcr(3.1);
        assert.equal(a2.qualis, 'A2');
        assert.equal(a2.quartil, 'Q1');

        const a3 = bio.estimarPorJcr(2.0);
        assert.equal(a3.qualis, 'A3');
        assert.equal(a3.quartil, 'Q2');

        const b1 = bio.estimarPorJcr(0.5);
        assert.equal(b1.qualis, 'B1');
        assert.equal(b1.quartil, 'Q4');

        const sem = bio.estimarPorJcr(null);
        assert.equal(sem.qualis, 'NC');
        assert.equal(sem.quartil, 'none');
    });
});

test('importacao de CSV', async (t) => {
    await t.test('importa CSV customizado e encontra na consulta', () => {
        const csv = 'ISSN;Título;Estrato;Quartil;JCR;SJR;CiteScore\n' +
                    '9999-0001;Revista Nova de Teste;A1;Q1;7.8;2.3;8.5\n' +
                    '9999-0002;Revista B1;B1;Q3;1.2;0.4;1.5';
        const n = bio.importarCSV(csv);
        assert.equal(n, 2);

        const r1 = bio.lookup('9999-0001');
        assert.ok(r1);
        assert.equal(r1.journalName, 'Revista Nova de Teste');
        assert.equal(r1.qualis, 'A1');
        assert.equal(r1.quartil, 'Q1');
        assert.equal(r1.jcr, 7.8);
        assert.equal(r1.sjr, 2.3);
        assert.equal(r1.citeScore, 8.5);
    });
});
