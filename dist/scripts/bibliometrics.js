/**
 * bibliometrics.js - Módulo de Inteligência Bibliométrica para o JCRLattes
 *
 * Fornece mapeamento e resolução de:
 * - Qualis CAPES (A1, A2, A3, A4, B1, B2, B3, B4, C, NC)
 * - Quartis Clarivate JCR e Scopus/SCImago (Q1, Q2, Q3, Q4)
 * - Fator de Impacto (JCR), SJR e CiteScore
 * - Pontuações CAPES ponderadas e paletas acessíveis para daltônicos
 * - Suporte a importação de CSV personalizado pelo usuário (Sucupira / SCImago)
 */
(function (raiz) {
    'use strict';

    const STORAGE_KEY = 'jcr_custom_bibliometrics';

    // Banco de sementes integrado (250+ periódicos de referência)
    const SEED_DATABASE = {
    "01657380": {
        "nome": "Veterinary Research Communications",
        "jcr": 2.2,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A2",
        "subarea": "Small Animals",
        "citeScore": 1.88,
        "hIndex": 82
    },
    "20797737": {
        "nome": "Biology (MDPI)",
        "jcr": 3.5,
        "quartilJcr": "Q1",
        "quartil": "Q2",
        "qualis": "A3",
        "subarea": "Immunology",
        "citeScore": 3.74,
        "hIndex": 134
    },
    "09737138": {
        "nome": "Journal of Biosciences",
        "jcr": 2.0,
        "quartilJcr": "Q3",
        "quartil": "Q2",
        "qualis": "A3",
        "subarea": "Genetics",
        "citeScore": 2.44,
        "hIndex": 112
    },
    "15709639": {
        "nome": "BBA – Proteins and Proteomics",
        "jcr": 2.5,
        "quartilJcr": "Q3",
        "quartil": "Q2",
        "qualis": "A4",
        "subarea": "Molecular Biology",
        "citeScore": 1.73,
        "hIndex": 160
    },
    "22124403": {
        "nome": "Oral Surg Oral Med Oral Pathol Oral Radiol",
        "jcr": 1.9,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A5",
        "subarea": "Oral Surgery",
        "citeScore": 0.58,
        "hIndex": 88
    },
    "18747787": {
        "nome": "Marine Genomics",
        "jcr": 1.3,
        "quartilJcr": "Q4",
        "quartil": "Q3",
        "qualis": "A5",
        "subarea": "Molecular Biology",
        "citeScore": 1.0,
        "hIndex": 55
    },
    "24701394": {
        "nome": "Mitochondrial DNA Part A",
        "jcr": 1.1,
        "quartilJcr": "Q4",
        "quartil": "Q3",
        "qualis": "A5",
        "subarea": "Molecular Biology",
        "citeScore": 0.91,
        "hIndex": 35
    },
    "21617856": {
        "nome": "Games for Health Journal",
        "jcr": 2.6,
        "quartilJcr": "Q2",
        "quartil": "Q2",
        "qualis": "A2",
        "subarea": "Health Care Sciences & Services"
    },
    "2161783X": {
        "nome": "Games for Health Journal",
        "jcr": 2.6,
        "quartilJcr": "Q2",
        "quartil": "Q1",
        "qualis": "A1",
        "subarea": "Developmental and Educational Psychology",
        "citeScore": 4.13,
        "hIndex": 68
    },
    "26737426": {
        "nome": "BioMedInformatics",
        "jcr": null,
        "quartilJcr": null,
        "quartil": "Q1",
        "qualis": "A1",
        "subarea": "Health Information Management",
        "citeScore": 6.99,
        "hIndex": 29
    },
    "00448486": {
        "nome": "Aquaculture",
        "jcr": 3.9,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "subarea": "Aquatic Science",
        "citeScore": 4.73,
        "hIndex": 279
    },
    "00142972": {
        "nome": "European Journal of Clinical Investigation",
        "jcr": 4.4,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "subarea": "Surgery",
        "citeScore": 4.9,
        "hIndex": 166
    },
    "00062952": {
        "nome": "Biochemical Pharmacology",
        "jcr": 5.3,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "subarea": "Pharmacology",
        "citeScore": 5.14,
        "hIndex": 292
    },
    "24701343": {
        "nome": "ACS Omega",
        "jcr": 3.7,
        "quartilJcr": "Q2",
        "quartil": "Q1",
        "qualis": "A1",
        "subarea": "Computational Theory and Mathematics",
        "citeScore": 5.07,
        "hIndex": 178
    },
    "21693536": {
        "nome": "IEEE Access",
        "jcr": 3.4,
        "quartilJcr": "Q2",
        "quartil": "Q2",
        "qualis": "A2",
        "sjr": 0.9,
        "citeScore": 6.2,
        "subarea": "Computer Science / Engineering",
        "openAccess": true
    },
    "20452322": {
        "nome": "Scientific Reports",
        "jcr": 3.8,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 1.05,
        "citeScore": 6.5,
        "subarea": "Multidisciplinary",
        "openAccess": true
    },
    "03048608": {
        "nome": "Archives of Virology",
        "jcr": 2.5,
        "quartilJcr": "Q3",
        "quartil": "Q1",
        "qualis": "A2",
        "subarea": "Epidemiology",
        "citeScore": 2.06,
        "hIndex": 170
    },
    "1742464X": {
        "nome": "FEBS Journal",
        "jcr": 5.5,
        "quartilJcr": "Q1",
        "quartil": "Q2",
        "qualis": "A3",
        "subarea": "Molecular Biology",
        "citeScore": 3.79,
        "hIndex": 226
    },
    "00039861": {
        "nome": "Archives of Biochemistry and Biophysics",
        "jcr": 3.8,
        "quartilJcr": "Q2",
        "quartil": "Q2",
        "qualis": "A3",
        "subarea": "Molecular Biology",
        "citeScore": 3.78,
        "hIndex": 296
    },
    "13591053": {
        "nome": "Journal of Health Psychology",
        "jcr": 2.4,
        "quartilJcr": "Q2",
        "quartil": "Q2",
        "qualis": "A3",
        "subarea": "Clinical Psychology",
        "citeScore": 1.84,
        "hIndex": 144
    },
    "03044165": {
        "nome": "BBA – General Subjects",
        "jcr": 2.8,
        "quartilJcr": "Q3",
        "quartil": "Q2",
        "qualis": "A3",
        "subarea": "Molecular Biology",
        "citeScore": 3.21,
        "hIndex": 242
    },
    "24464732": {
        "nome": "Research on Biomedical Engineering",
        "jcr": 1.3,
        "quartilJcr": "Q4",
        "quartil": "Q4",
        "qualis": "A4",
        "sjr": 0.45,
        "citeScore": 1.8,
        "subarea": "Biomedical Engineering",
        "openAccess": true
    },
    "16784685": {
        "nome": "Genetics and Molecular Biology",
        "jcr": 1.9,
        "quartilJcr": "Q4",
        "quartil": "Q4",
        "qualis": "A4",
        "sjr": 0.6,
        "citeScore": 2.5,
        "subarea": "Genetics",
        "openAccess": true
    },
    "19887833": {
        "nome": "Contribuciones a las Ciencias Sociales",
        "citeScore": 0.14,
        "hIndex": 12
    },
    "23582472": {
        "nome": "Aracê.",
        "citeScore": 0.22,
        "hIndex": 7
    },
    "2317417X": {
        "nome": "Revista InCantare",
        "citeScore": 0.14,
        "hIndex": 3
    },
    "23594632": {
        "nome": "Revista Científica Integrada",
        "citeScore": 0.2,
        "hIndex": 2
    },
    "25951661": {
        "nome": "Revista JRG de Estudos Acadêmicos",
        "citeScore": 0.23,
        "hIndex": 5
    },
    "19819919": {
        "nome": "Revista brasileira de obesidade, nutrição e emagrecimento",
        "citeScore": 0.0,
        "hIndex": 1
    },
    "21754411": {
        "nome": "Journal of Health Informatics",
        "citeScore": 0.43,
        "hIndex": 10
    },
    "25265970": {
        "nome": "Revista Communitas",
        "citeScore": 0.1,
        "hIndex": 3
    },
    "26748703": {
        "nome": "Revista de Estudos Interdisciplinares",
        "citeScore": 0.17,
        "hIndex": 4
    },
    "24478733": {
        "nome": "Revista de Ensino Educação e Ciências Humanas",
        "citeScore": 0.16,
        "hIndex": 10
    },
    "16968352": {
        "nome": "OBSERVATÓRIO DE LA ECONOMÍA LATINOAMERICANA",
        "citeScore": 0.22,
        "hIndex": 11
    },
    "30858097": {
        "nome": "Brazilian Journal of Oral and Systemic Health",
        "citeScore": 0.0,
        "hIndex": 0
    },
    "26748169": {
        "nome": "Brazilian Journal of Implantology and Health Sciences",
        "citeScore": 0.35,
        "hIndex": 12
    },
    "19894155": {
        "nome": "Cuadernos de Educación y Desarrollo",
        "citeScore": 0.26,
        "hIndex": 13
    },
    "25956825": {
        "nome": "Brazilian Journal of Health Review",
        "citeScore": 0.2,
        "hIndex": 26
    },
    "23595787": {
        "nome": "Revista Acadêmica Online",
        "citeScore": 0.11,
        "hIndex": 4
    },
    "25255711": {
        "nome": "JORDI - Journal of Oral Diagnosis",
        "citeScore": 0.2,
        "hIndex": 7
    },
    "26749432": {
        "nome": "Periódicos Brasil Pesquisa Científica",
        "citeScore": 0.12,
        "hIndex": 4
    },
    "26756218": {
        "nome": "RECIMA21 - Revista Científica Multidisciplinar",
        "citeScore": 0.21,
        "hIndex": 21
    },
    "23173793": {
        "nome": "REVISTA DIÁLOGOS INTERDISCIPLINARES"
    },
    "21786925": {
        "nome": "Revista Multidisciplinar do Nordeste Mineiro",
        "citeScore": 0.62,
        "hIndex": 20
    },
    "21782091": {
        "nome": "Revista Eletrônica Acervo Saúde",
        "citeScore": 0.21,
        "hIndex": 29
    },
    "14133555": {
        "nome": "Revista Brasileira de Fisioterapia",
        "qualis": "NC",
        "quartil": null
    },
    "08869634": {
        "nome": "Cranio. Journal of Craniomandibular Practice",
        "qualis": "NC",
        "quartil": null
    },
    "00347299": {
        "nome": "Revista Brasileira de Otorrinolaringologia (Impresso)",
        "qualis": "NC",
        "quartil": null
    },
    "14141639": {
        "nome": "Treinamento Desportivo",
        "qualis": "NC",
        "quartil": null
    },
    "1678054X": {
        "nome": "Revista brasileira de ciências da saúde (IMES)",
        "qualis": "NC",
        "quartil": null
    },
    "01044850": {
        "nome": "Revista de Odontologia da UNICID",
        "qualis": "NC",
        "quartil": null
    },
    "01003992": {
        "nome": "Arquivos Médicos do ABC",
        "qualis": "NC",
        "quartil": null
    },
    "01041282": {
        "nome": "Revista Brasileira de Crescimento e Desenvolvimento Humano",
        "qualis": "NC",
        "quartil": null
    },
    "00347272": {
        "nome": "Revista Brasileira de Odontologia",
        "qualis": "NC",
        "quartil": null
    },
    "16775937": {
        "nome": "Terapia Manual",
        "qualis": "NC",
        "quartil": null
    },
    "16771028": {
        "nome": "ConScientiae Saúde (Impresso)",
        "qualis": "NC",
        "quartil": null
    },
    "15189740": {
        "nome": "Fisioterapia Brasil",
        "qualis": "NC",
        "quartil": null
    },
    "18068324": {
        "nome": "Brazilian Oral Research (Impresso)",
        "qualis": "NC",
        "quartil": null
    },
    "0301150X": {
        "nome": "Electromyography and Clinical Neurophysiology",
        "qualis": "NC",
        "quartil": null
    },
    "15161846": {
        "nome": "Revista CEFAC (Impresso)",
        "qualis": "NC",
        "quartil": null
    },
    "09155287": {
        "nome": "Journal of Physical Therapy Science",
        "qualis": "NC",
        "quartil": null
    },
    "18952089": {
        "nome": "Clinical and Experimental Medical Letters",
        "qualis": "NC",
        "quartil": null
    },
    "23290072": {
        "nome": "Medical Science and Technology",
        "qualis": "NC",
        "quartil": null
    },
    "18093469": {
        "nome": "Fisioterapia Ser",
        "qualis": "NC",
        "quartil": null
    },
    "17456215": {
        "nome": "Trials (London)",
        "qualis": "NC",
        "quartil": null
    },
    "01614754": {
        "nome": "Journal of Manipulative and Physiological Therapeutics",
        "qualis": "NC",
        "quartil": null
    },
    "1916257X": {
        "nome": "INTERNATIONAL JOURNAL OF THERAPEUTIC MASSAGE & BODYWORK",
        "qualis": "NC",
        "quartil": null
    },
    "09666362": {
        "nome": "Gait & Posture",
        "qualis": "NC",
        "quartil": null
    },
    "22365435": {
        "nome": "Revista Terapia Manual",
        "qualis": "NC",
        "quartil": null
    },
    "13441272": {
        "nome": "JOURNAL OF THE JAPANESE PHYSICAL THERAPY ASSOCIATION",
        "qualis": "NC",
        "quartil": null
    },
    "01035150": {
        "nome": "FISIOTERAPIA EM MOVIMENTO (PUCPR. IMPRESSO)",
        "qualis": "NC",
        "quartil": null
    },
    "10538127": {
        "nome": "JOURNAL OF BACK AND MUSCULOSKELETAL REHABILITATION",
        "qualis": "NC",
        "quartil": null
    },
    "1356689X": {
        "nome": "Manual Therapy",
        "qualis": "NC",
        "quartil": null
    },
    "19820216": {
        "nome": "REVISTA CEFAC (ONLINE)",
        "qualis": "NC",
        "quartil": null
    },
    "25255150": {
        "nome": "REVISTA CIENTÍFICA UMC",
        "qualis": "NC",
        "quartil": null
    },
    "20571976": {
        "nome": "BIOMEDICAL PHYSICS & ENGINEERING EXPRESS",
        "qualis": "NC",
        "quartil": null
    },
    "1980220X": {
        "nome": "REVISTA DA ESCOLA DE ENFERMAGEM DA USP",
        "qualis": "NC",
        "quartil": null
    },
    "1435604X": {
        "nome": "Lasers in Medical Science (on line)",
        "qualis": "NC",
        "quartil": null
    },
    "01400118": {
        "nome": "Medical & Biological Engineering & Computing",
        "qualis": "NC",
        "quartil": null
    },
    "00942405": {
        "nome": "Medical Physics",
        "qualis": "NC",
        "quartil": null
    },
    "22361294": {
        "nome": "REVERTE",
        "qualis": "NC",
        "quartil": null
    },
    "21778310": {
        "nome": "EAD em Foco",
        "qualis": "NC",
        "quartil": null
    },
    "16627482": {
        "nome": "Applied Mechanics and Materials",
        "qualis": "NC",
        "quartil": null
    },
    "19326203": {
        "nome": "PLOS ONE",
        "jcr": 2.9,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 0.85,
        "citeScore": 4.5,
        "subarea": "Multidisciplinary",
        "openAccess": true
    },
    "16629795": {
        "nome": "Key Engineering Materials (Online)",
        "qualis": "NC",
        "quartil": null
    },
    "23163852": {
        "nome": "Augusto Guzzo Revista Acadêmica (São Paulo)",
        "qualis": "NC",
        "quartil": null
    },
    "21792895": {
        "nome": "RIT - REVISTA INOVAÇÃO TECNOLÓGICA",
        "qualis": "NC",
        "quartil": null
    },
    "23162341": {
        "nome": "ENIAC Pesquisa",
        "qualis": "NC",
        "quartil": null
    },
    "21567018": {
        "nome": "Journal of Medical Imaging and Health Informatics",
        "qualis": "NC",
        "quartil": null
    },
    "21769427": {
        "nome": "FaSCi-Tech",
        "qualis": "NC",
        "quartil": null
    },
    "24464740": {
        "nome": "RESEARCH ON BIOMEDICAL ENGINEERING",
        "qualis": "NC",
        "quartil": null
    },
    "18069940": {
        "nome": "REVISTA BRASILEIRA DE MEDICINA DO ESPORTE (ONLINE)",
        "qualis": "NC",
        "quartil": null
    },
    "16877047": {
        "nome": "INTERNATIONAL JOURNAL OF COMPUTER GAMES TECHNOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "17526418": {
        "nome": "INTERNATIONAL JOURNAL OF BIOMEDICAL ENGINEERING AND TECHNOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "25782762": {
        "nome": "Global Clinical Engineering Journal",
        "qualis": "NC",
        "quartil": null
    },
    "25255250": {
        "nome": "Revista Científica UMC",
        "qualis": "NC",
        "quartil": null
    },
    "22371753": {
        "nome": "Revista UniVap",
        "qualis": "NC",
        "quartil": null
    },
    "23588322": {
        "nome": "HUMANIDADES & INOVAÇÃO",
        "qualis": "NC",
        "quartil": null
    },
    "19814313": {
        "nome": "COLEÇÃO PESQUISA EM EDUCAÇÃO FÍSICA",
        "qualis": "NC",
        "quartil": null
    },
    "09763031": {
        "nome": "INTERNATIONAL JOURNAL OF RECENT SCIENTIFIC RESEARCH",
        "qualis": "NC",
        "quartil": null
    },
    "1350911X": {
        "nome": "ELECTRONICS LETTERS (ONLINE)",
        "qualis": "NC",
        "quartil": null
    },
    "24470783": {
        "nome": "REVISTA ELETRÔNICA CIENTÍFICA ENSINO INTERDISCIPLINAR",
        "qualis": "NC",
        "quartil": null
    },
    "15480992": {
        "nome": "IEEE Latin America Transactions",
        "qualis": "NC",
        "quartil": null
    },
    "26755602": {
        "nome": "Global Academic Nursing Journal",
        "qualis": "NC",
        "quartil": null
    },
    "25253409": {
        "nome": "RESEARCH, SOCIETY AND DEVELOPMENT",
        "qualis": "NC",
        "quartil": null
    },
    "24465763": {
        "nome": "SOUTH AMERICAN DEVELOPMENT SOCIETY JOURNAL",
        "qualis": "NC",
        "quartil": null
    },
    "16780817": {
        "nome": "REVISTA FISIO&TERAPIA",
        "qualis": "NC",
        "quartil": null
    },
    "24470961": {
        "nome": "CONTEMPORÂNEA - REVISTA DE ÉTICA E FILOSOFIA POLÍTICA",
        "qualis": "NC",
        "quartil": null
    },
    "19830882": {
        "nome": "CADERNO PEDAGÓGICO (LAJEADO. ONLINE)",
        "qualis": "NC",
        "quartil": null
    },
    "2278487X": {
        "nome": "International Organization of Scientific Research",
        "qualis": "NC",
        "quartil": null
    },
    "25957899": {
        "nome": "Revista Eletrônica Acervo Científico",
        "qualis": "NC",
        "quartil": null
    },
    "19885245": {
        "nome": "DELOS: DESARROLLO LOCAL SOSTENIBLE",
        "qualis": "NC",
        "quartil": null
    },
    "21769141": {
        "nome": "Boletim Informativo Unimotrisaúde em Sociogerontologia",
        "qualis": "NC",
        "quartil": null
    },
    "15170306": {
        "nome": "PRINCIPIA (JOÃO PESSOA)",
        "qualis": "NC",
        "quartil": null
    },
    "23200847": {
        "nome": "AMERICAN JOURNAL OF ENGINEERING RESEARCH",
        "qualis": "NC",
        "quartil": null
    },
    "22489622": {
        "nome": "INTERNATIONAL JOURNAL OF ENGINEERING RESEARCH AND APPLICATIONS (IJERA)",
        "qualis": "NC",
        "quartil": null
    },
    "22503021": {
        "nome": "IOSR JOURNAL OF ENGINEERING",
        "qualis": "NC",
        "quartil": null
    },
    "0277786X": {
        "nome": "PROCEEDINGS OF SPIE, THE INTERNATIONAL SOCIETY FOR OPTICAL ENGINEERING",
        "qualis": "NC",
        "quartil": null
    },
    "23185589": {
        "nome": "REVISTA UNIVERSITAS",
        "qualis": "NC",
        "quartil": null
    },
    "00806234": {
        "nome": "Revista da Escola de Enfermagem da USP",
        "qualis": "NC",
        "quartil": null
    },
    "0006291X": {
        "nome": "Biochemical and Biophysical Research Communications",
        "jcr": 2.5,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A3",
        "sjr": 0.8,
        "citeScore": 4.3,
        "subarea": "Biophysics",
        "openAccess": false
    },
    "02646021": {
        "nome": "Biochemical Journal (London. 1984)",
        "qualis": "NC",
        "quartil": null
    },
    "10447431": {
        "nome": "Molecular and Cellular Neurosciences",
        "qualis": "NC",
        "quartil": null
    },
    "03781135": {
        "nome": "Veterinary Microbiology (Amsterdam. Print)",
        "qualis": "NC",
        "quartil": null
    },
    "00223956": {
        "nome": "Journal of Psychiatric Research",
        "qualis": "NC",
        "quartil": null
    },
    "00220345": {
        "nome": "JOURNAL OF DENTAL RESEARCH",
        "qualis": "NC",
        "quartil": null
    },
    "03014622": {
        "nome": "BIOPHYSICAL CHEMISTRY",
        "qualis": "NC",
        "quartil": null
    },
    "13816128": {
        "nome": "CURRENT PHARMACEUTICAL DESIGN",
        "qualis": "NC",
        "quartil": null
    },
    "10972765": {
        "nome": "MOLECULAR CELL",
        "qualis": "NC",
        "quartil": null
    },
    "09680896": {
        "nome": "BIOORGANIC & MEDICINAL CHEMISTRY",
        "qualis": "NC",
        "quartil": null
    },
    "14220067": {
        "nome": "INTERNATIONAL JOURNAL OF MOLECULAR SCIENCES",
        "qualis": "NC",
        "quartil": null
    },
    "22311866": {
        "nome": "JOURNAL OF BIOLOGICALLY ACTIVE PRODUCTS FROM NATURE",
        "qualis": "NC",
        "quartil": null
    },
    "18788181": {
        "nome": "BIOCATALYSIS AND AGRICULTURAL BIOTECHNOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "21698287": {
        "nome": "GENOME ANNOUNCEMENTS",
        "qualis": "NC",
        "quartil": null
    },
    "00062960": {
        "nome": "BIOCHEMISTRY",
        "qualis": "NC",
        "quartil": null
    },
    "2047217X": {
        "nome": "GigaScience",
        "qualis": "NC",
        "quartil": null
    },
    "19352735": {
        "nome": "PLoS Neglected Tropical Diseases",
        "qualis": "NC",
        "quartil": null
    },
    "14602059": {
        "nome": "Bioinformatics",
        "qualis": "NC",
        "quartil": null
    },
    "13693786": {
        "nome": "MEDICAL MYCOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "20461402": {
        "nome": "F1000RESEARCH",
        "qualis": "NC",
        "quartil": null
    },
    "2296701X": {
        "nome": "FRONTIERS IN ECOLOGY AND EVOLUTION",
        "qualis": "NC",
        "quartil": null
    },
    "2309608X": {
        "nome": "JOURNAL OF FUNGI",
        "qualis": "NC",
        "quartil": null
    },
    "22366814": {
        "nome": "REV. RESIDÊNCIA PEDIÁTRICA",
        "qualis": "NC",
        "quartil": null
    },
    "13500872": {
        "nome": "MICROBIOLOGY-SGM",
        "qualis": "NC",
        "quartil": null
    },
    "14362228": {
        "nome": "MARINE BIOTECHNOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "25824597": {
        "nome": "GSC Advanced Research and Reviews",
        "qualis": "NC",
        "quartil": null
    },
    "25829394": {
        "nome": "Magna Scientia Advanced Research and Reviews",
        "qualis": "NC",
        "quartil": null
    },
    "24480959": {
        "nome": "Revista Científica Multidisciplinar Núcleo do Conhecimento",
        "qualis": "NC",
        "quartil": null
    },
    "22340742": {
        "nome": "Genomics & Informatics",
        "qualis": "NC",
        "quartil": null
    },
    "16174615": {
        "nome": "MOLECULAR GENETICS AND GENOMICS",
        "qualis": "NC",
        "quartil": null
    },
    "24701408": {
        "nome": "Mitochondrial Dna Part A",
        "qualis": "NC",
        "quartil": null
    },
    "16165047": {
        "nome": "MAMMALIAN BIOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "14248581": {
        "nome": "CYTOGENETIC AND GENOME RESEARCH",
        "qualis": "NC",
        "quartil": null
    },
    "23169079": {
        "nome": "PHYLLOMEDUSA: JOURNAL OF HERPETOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "20751729": {
        "nome": "Life-Basel",
        "qualis": "NC",
        "quartil": null
    },
    "21798168": {
        "nome": "TARAIRIÚ. REVISTA ELETRÔNICA DO LABORATÓRIO DE ARQUEOLOGIA E PALEONTOLOGIA DA UEPB.",
        "qualis": "NC",
        "quartil": null
    },
    "01047795": {
        "nome": "Acta Fisiátrica",
        "qualis": "NC",
        "quartil": null
    },
    "13504533": {
        "nome": "Medical Engineering & Physics",
        "qualis": "NC",
        "quartil": null
    },
    "1475925X": {
        "nome": "Biomedical Engineering Online (Online)",
        "qualis": "NC",
        "quartil": null
    },
    "13608592": {
        "nome": "JOURNAL OF BODYWORK AND MOVEMENT THERAPIES",
        "qualis": "NC",
        "quartil": null
    },
    "23200936": {
        "nome": "AMERICAN JOURNAL OF ENGINEERING RESEARCH",
        "qualis": "NC",
        "quartil": null
    },
    "00135194": {
        "nome": "ELECTRONICS LETTERS",
        "qualis": "NC",
        "quartil": null
    },
    "00045276": {
        "nome": "Revista da APCD",
        "qualis": "NC",
        "quartil": null
    },
    "19805578": {
        "nome": "APPLIED CANCER RESEARCH (ONLINE)",
        "qualis": "NC",
        "quartil": null
    },
    "03005712": {
        "nome": "JOURNAL OF DENTISTRY",
        "qualis": "NC",
        "quartil": null
    },
    "17617227": {
        "nome": "International Orthodontics",
        "qualis": "NC",
        "quartil": null
    },
    "18073107": {
        "nome": "BRAZILIAN ORAL RESEARCH",
        "qualis": "NC",
        "quartil": null
    },
    "23175907": {
        "nome": "JOURNAL OF RESEARCH IN DENTISTRY",
        "qualis": "NC",
        "quartil": null
    },
    "25183745": {
        "nome": "Journal of the International Academy of Periodontology",
        "qualis": "NC",
        "quartil": null
    },
    "26400928": {
        "nome": "Journal of Research in Dentistry",
        "qualis": "NC",
        "quartil": null
    },
    "19373384": {
        "nome": "Tissue Engineering",
        "qualis": "NC",
        "quartil": null
    },
    "26753375": {
        "nome": "Revista Ibero-Americana de Humanidades, Ciências e Educação",
        "qualis": "NC",
        "quartil": null
    },
    "24175907": {
        "nome": "JOURNAL OF RESEARCH IN DENTISTRY",
        "qualis": "NC",
        "quartil": null
    },
    "19994923": {
        "nome": "PHARMACEUTICS",
        "qualis": "NC",
        "quartil": null
    },
    "16000765": {
        "nome": "JOURNAL OF PERIODONTAL RESEARCH",
        "qualis": "NC",
        "quartil": null
    },
    "81942781": {
        "nome": "Spie Medical Imaging",
        "qualis": "NC",
        "quartil": null
    },
    "15173151": {
        "nome": "Revista Brasileira de Engenharia Biomédica (Impresso)",
        "qualis": "NC",
        "quartil": null
    },
    "16609336": {
        "nome": "Applied Mechanics and Materials",
        "qualis": "NC",
        "quartil": null
    },
    "01692607": {
        "nome": "Computer Methods and Programs in Biomedicine (Print)",
        "qualis": "NC",
        "quartil": null
    },
    "24477400": {
        "nome": "Brasil Para Todos-Revista Internacional",
        "qualis": "NC",
        "quartil": null
    },
    "18071058": {
        "nome": "NEUROCIÊNCIAS (RIO DE JANEIRO)",
        "qualis": "NC",
        "quartil": null
    },
    "23805552": {
        "nome": "BAOJ Neurology",
        "qualis": "NC",
        "quartil": null
    },
    "17426588": {
        "nome": "JOURNAL OF PHYSICS. CONFERENCE SERIES (PRINT)",
        "qualis": "NC",
        "quartil": null
    },
    "09758887": {
        "nome": "INTERNATIONAL JOURNAL OF COMPUTER APPLICATIONS",
        "qualis": "NC",
        "quartil": null
    },
    "18076912": {
        "nome": "Revista Científica da FAMINAS",
        "qualis": "NC",
        "quartil": null
    },
    "17526426": {
        "nome": "International Journal of Biomedical Engineering and Technology",
        "qualis": "NC",
        "quartil": null
    },
    "03002896": {
        "nome": "ARCHIVOS DE BRONCONEUMOLOGIA",
        "qualis": "NC",
        "quartil": null
    },
    "21777691": {
        "nome": "INTERFACES DA EDUCAÇÃO",
        "qualis": "NC",
        "quartil": null
    },
    "24479187": {
        "nome": "PRINCIPIA (JOÃO PESSOA)",
        "qualis": "NC",
        "quartil": null
    },
    "00104825": {
        "nome": "COMPUTERS IN BIOLOGY AND MEDICINE",
        "qualis": "NC",
        "quartil": null
    },
    "17468094": {
        "nome": "Biomedical Signal Processing and Control",
        "qualis": "NC",
        "quartil": null
    },
    "19424787": {
        "nome": "Wiley Interdisciplinary Reviews-Data Mining and Knowledge Discovery",
        "qualis": "NC",
        "quartil": null
    },
    "17426596": {
        "nome": "JOURNAL OF PHYSICS. CONFERENCE SERIES (ONLINE)",
        "qualis": "NC",
        "quartil": null
    },
    "08932174": {
        "nome": "INTERNATIONAL JOURNAL OF PROSTHODONTICS",
        "qualis": "NC",
        "quartil": null
    },
    "00992399": {
        "nome": "JOURNAL OF ENDODONTICS",
        "qualis": "NC",
        "quartil": null
    },
    "00039969": {
        "nome": "ARCHIVES OF ORAL BIOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "16878787": {
        "nome": "INTERNATIONAL JOURNAL OF BIOMATERIALS",
        "qualis": "NC",
        "quartil": null
    },
    "15524965": {
        "nome": "Journal of Biomedical Materials Research Part A",
        "qualis": "NC",
        "quartil": null
    },
    "03032647": {
        "nome": "Biosystems (Amsterdam. Print)",
        "qualis": "NC",
        "quartil": null
    },
    "00315125": {
        "nome": "Perceptual and Motor Skills",
        "qualis": "NC",
        "quartil": null
    },
    "16800737": {
        "nome": "IFMBE Proceedings",
        "qualis": "NC",
        "quartil": null
    },
    "19805586": {
        "nome": "Brazilian Journal of Motor Behavior",
        "qualis": "NC",
        "quartil": null
    },
    "19985509": {
        "nome": "Global Telemedicine and eHealth Updates: Knowledge Resources",
        "qualis": "NC",
        "quartil": null
    },
    "20703724": {
        "nome": "WORLD  ACADEMY OF SCIENCE, ENGINEERING AND TECHNOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "22361103": {
        "nome": "Revista Brasileira de Inovação Tecnologica em Saúde",
        "qualis": "NC",
        "quartil": null
    },
    "19341482": {
        "nome": "PM & R (Philadelphia, 2009): the journal of injury, function and rehabilitation",
        "qualis": "NC",
        "quartil": null
    },
    "11357606": {
        "nome": "Cuadernos de Medicina Forense",
        "qualis": "NC",
        "quartil": null
    },
    "08949115": {
        "nome": "AMERICAN JOURNAL OF PHYSICAL MEDICINE & REHABILITATION",
        "qualis": "NC",
        "quartil": null
    },
    "23583568": {
        "nome": "XII SIMPÓSIO DE ENGENHARIA BIOMÉDICA - IX SIMPÓSIO DE INSTRUMENTAÇÃO E IMAGENS MÉDICAS",
        "qualis": "NC",
        "quartil": null
    },
    "15181812": {
        "nome": "BIS. Boletim do Instituto de Saúde (Impresso)",
        "qualis": "NC",
        "quartil": null
    },
    "23593164": {
        "nome": "XXIV CBEB",
        "qualis": "NC",
        "quartil": null
    },
    "19808623": {
        "nome": "PSICO (PUCRS. ONLINE)",
        "qualis": "NC",
        "quartil": null
    },
    "0732183X": {
        "nome": "JOURNAL OF CLINICAL ONCOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "23320877": {
        "nome": "JOURNAL OF INFECTIOUS DISEASES AND THERAPY",
        "qualis": "NC",
        "quartil": null
    },
    "15155579": {
        "nome": "Revista medica de Tucumán",
        "qualis": "NC",
        "quartil": null
    },
    "01035371": {
        "nome": "PSICO (PUCRS. IMPRESSO)",
        "qualis": "NC",
        "quartil": null
    },
    "0233111X": {
        "nome": "JOURNAL OF BASIC MICROBIOLOGY",
        "qualis": "NC",
        "quartil": null
    },
    "10752765": {
        "nome": "AMERICAN JOURNAL OF THERAPEUTICS",
        "qualis": "NC",
        "quartil": null
    },
    "1664042X": {
        "nome": "Frontiers in Physiology",
        "qualis": "NC",
        "quartil": null
    },
    "00280836": {
        "nome": "Nature",
        "jcr": 50.5,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 12.5,
        "citeScore": 45.0,
        "subarea": "Multidisciplinary",
        "openAccess": true
    },
    "14764687": {
        "nome": "Nature (Online)",
        "jcr": 50.5,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 12.5,
        "citeScore": 45.0,
        "subarea": "Multidisciplinary",
        "openAccess": true
    },
    "00368075": {
        "nome": "Science",
        "jcr": 44.7,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 11.2,
        "citeScore": 40.0,
        "subarea": "Multidisciplinary",
        "openAccess": true
    },
    "10959203": {
        "nome": "Science (Online)",
        "jcr": 44.7,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 11.2,
        "citeScore": 40.0,
        "subarea": "Multidisciplinary",
        "openAccess": true
    },
    "00928674": {
        "nome": "Cell",
        "jcr": 45.5,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 15.0,
        "citeScore": 42.0,
        "subarea": "Biochemistry & Molecular Biology",
        "openAccess": true
    },
    "01406736": {
        "nome": "The Lancet",
        "jcr": 98.4,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 18.0,
        "citeScore": 75.0,
        "subarea": "Medicine, General & Internal",
        "openAccess": true
    },
    "00284793": {
        "nome": "New England Journal of Medicine",
        "jcr": 96.2,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 17.5,
        "citeScore": 80.0,
        "subarea": "Medicine, General & Internal",
        "openAccess": true
    },
    "00278424": {
        "nome": "Proceedings of the National Academy of Sciences (PNAS)",
        "jcr": 9.4,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 3.8,
        "citeScore": 11.0,
        "subarea": "Multidisciplinary",
        "openAccess": true
    },
    "10916490": {
        "nome": "PNAS (Online)",
        "jcr": 9.4,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 3.8,
        "citeScore": 11.0,
        "subarea": "Multidisciplinary",
        "openAccess": true
    },
    "1474175X": {
        "nome": "Nature Reviews Molecular Cell Biology",
        "jcr": 81.3,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 25.0,
        "citeScore": 70.0,
        "subarea": "Cell Biology",
        "openAccess": true
    },
    "09598138": {
        "nome": "BMJ (British Medical Journal)",
        "jcr": 93.6,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 5.5,
        "citeScore": 20.0,
        "subarea": "Medicine, General & Internal",
        "openAccess": true
    },
    "00987484": {
        "nome": "JAMA",
        "jcr": 63.1,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 8.5,
        "citeScore": 30.0,
        "subarea": "Medicine, General & Internal",
        "openAccess": true
    },
    "00189219": {
        "nome": "Proceedings of the IEEE",
        "jcr": 20.6,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 5.2,
        "citeScore": 28.0,
        "subarea": "Electrical & Electronic Engineering",
        "openAccess": true
    },
    "00045411": {
        "nome": "Journal of the ACM",
        "jcr": 3.1,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 1.5,
        "citeScore": 4.2,
        "subarea": "Computer Science",
        "openAccess": true
    },
    "00010782": {
        "nome": "Communications of the ACM",
        "jcr": 11.1,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 3.2,
        "citeScore": 14.0,
        "subarea": "Computer Science",
        "openAccess": true
    },
    "00319007": {
        "nome": "Physical Review Letters",
        "jcr": 8.1,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 3.5,
        "citeScore": 9.8,
        "subarea": "Physics, Multidisciplinary",
        "openAccess": true
    },
    "00027863": {
        "nome": "Journal of the American Chemical Society (JACS)",
        "jcr": 14.4,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 5.8,
        "citeScore": 16.5,
        "subarea": "Chemistry, Multidisciplinary",
        "openAccess": true
    },
    "00219258": {
        "nome": "Journal of Biological Chemistry",
        "jcr": 4.0,
        "quartilJcr": "Q1",
        "quartil": "Q1",
        "qualis": "A1",
        "sjr": 1.9,
        "citeScore": 6.8,
        "subarea": "Biochemistry & Molecular Biology",
        "openAccess": true
    },
    "01007203": {
        "nome": "Revista Brasileira de Ginecologia e Obstetrícia",
        "jcr": 1.2,
        "quartilJcr": "Q4",
        "quartil": "Q4",
        "qualis": "B1",
        "sjr": 0.35,
        "citeScore": 1.5,
        "subarea": "Obstetrics & Gynecology",
        "openAccess": true
    },
    "01044230": {
        "nome": "Revista da Associação Médica Brasileira",
        "jcr": 1.2,
        "quartilJcr": "Q4",
        "quartil": "Q4",
        "qualis": "B1",
        "sjr": 0.4,
        "citeScore": 1.6,
        "subarea": "Medicine",
        "openAccess": true
    },
    "0102311X": {
        "nome": "Cadernos de Saúde Pública",
        "jcr": 1.9,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A2",
        "sjr": 0.7,
        "citeScore": 2.8,
        "subarea": "Public Health",
        "openAccess": true
    },
    "00348910": {
        "nome": "Revista de Saúde Pública",
        "jcr": 2.1,
        "quartilJcr": "Q2",
        "quartil": "Q2",
        "qualis": "A2",
        "sjr": 0.8,
        "citeScore": 3.2,
        "subarea": "Public Health",
        "openAccess": true
    },
    "14138123": {
        "nome": "Ciência & Saúde Coletiva",
        "jcr": 1.4,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A3",
        "sjr": 0.55,
        "citeScore": 2.1,
        "subarea": "Public Health",
        "openAccess": true
    },
    "01035053": {
        "nome": "Journal of the Brazilian Chemical Society",
        "jcr": 1.8,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A3",
        "sjr": 0.5,
        "citeScore": 2.2,
        "subarea": "Chemistry",
        "openAccess": true
    },
    "01006916": {
        "nome": "Engenharia Agrícola",
        "jcr": 1.1,
        "quartilJcr": "Q4",
        "quartil": "Q4",
        "qualis": "B1",
        "sjr": 0.35,
        "citeScore": 1.4,
        "subarea": "Agricultural Engineering",
        "openAccess": true
    },
    "15161439": {
        "nome": "Materials Research",
        "jcr": 1.5,
        "quartilJcr": "Q4",
        "quartil": "Q4",
        "qualis": "A4",
        "sjr": 0.45,
        "citeScore": 2.1,
        "subarea": "Materials Science",
        "openAccess": true
    },
    "01046632": {
        "nome": "Brazilian Journal of Chemical Engineering",
        "jcr": 1.5,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A4",
        "sjr": 0.48,
        "citeScore": 2.3,
        "subarea": "Chemical Engineering",
        "openAccess": true
    },
    "16784596": {
        "nome": "Ciência Rural",
        "jcr": 1.0,
        "quartilJcr": "Q4",
        "quartil": "Q4",
        "qualis": "B1",
        "sjr": 0.35,
        "citeScore": 1.6,
        "subarea": "Agronomy & Agriculture",
        "openAccess": true
    },
    "01002945": {
        "nome": "Revista Brasileira de Fruticultura",
        "jcr": 1.1,
        "quartilJcr": "Q4",
        "quartil": "Q4",
        "qualis": "B1",
        "sjr": 0.38,
        "citeScore": 1.5,
        "subarea": "Horticulture",
        "openAccess": true
    },
    "19842961": {
        "nome": "Revista Brasileira de Parasitologia Veterinária",
        "jcr": 1.3,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A4",
        "sjr": 0.45,
        "citeScore": 1.9,
        "subarea": "Parasitology / Veterinary",
        "openAccess": true
    },
    "16785150": {
        "nome": "Brazilian Journal of Medical and Biological Research",
        "jcr": 1.9,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A3",
        "sjr": 0.65,
        "citeScore": 2.7,
        "subarea": "Biomedical Sciences",
        "openAccess": true
    },
    "01008455": {
        "nome": "Revista Brasileira de Genética",
        "jcr": 1.4,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A3",
        "sjr": 0.5,
        "citeScore": 2.0,
        "subarea": "Genetics",
        "openAccess": true
    },
    "00378682": {
        "nome": "Revista da Sociedade Brasileira de Medicina Tropical",
        "jcr": 1.4,
        "quartilJcr": "Q3",
        "quartil": "Q3",
        "qualis": "A3",
        "sjr": 0.55,
        "citeScore": 2.2,
        "subarea": "Tropical Medicine",
        "openAccess": true
    }
};

    // Base em memória (mescla da semente + customizações do usuário)
    let customDatabase = {};
    let isLoaded = false;

    // Normaliza ISSN para 8 caracteres sem hífen em maiúsculas (ex: '2161-783X' -> '2161783X')
    function normalizarIssn(issn) {
        if (!issn) return '';
        const limpo = String(issn).replace(/[^0-9Xx]/g, '').toUpperCase();
        return limpo.length === 8 ? limpo : '';
    }

    // Normaliza nome de periódico para busca fonética/aproximada
    function normalizarTitulo(nome) {
        return String(nome || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Paleta acessível para Qualis (contraste alto e amigável para daltonismo)
    const CORES_QUALIS = {
        'A1': '#006655', // Teal escuro (excelência)
        'A2': '#009988', // Teal médio
        'A3': '#0077BB', // Azul
        'A4': '#33BBEE', // Ciano
        'B1': '#EE7733', // Laranja
        'B2': '#F59E0B', // Âmbar
        'B3': '#D97706', // Ocre
        'B4': '#B45309', // Marrom alaranjado
        'C':  '#78909C', // Cinza azulado
        'NC': '#9E9E9E'  // Cinza claro (Não Classificado)
    };

    // Paleta acessível para Quartis (Vibrant)
    const CORES_QUARTIL = {
        'Q1': '#009988', // Verde-azulado
        'Q2': '#0077BB', // Azul
        'Q3': '#EE7733', // Laranja
        'Q4': '#CC3311', // Vermelho
        'none': '#888888' // Cinza
    };

    // Pontuação CAPES tradicional ponderada
    const PONTOS_QUALIS = {
        'A1': 100,
        'A2': 85,
        'A3': 70,
        'A4': 55,
        'B1': 40,
        'B2': 25,
        'B3': 10,
        'B4': 5,
        'C': 0,
        'NC': 0
    };

    /**
     * Estima estrato Qualis e Quartil a partir do Fator de Impacto (JCR)
     * quando a revista não estiver explicitamente mapeada na base.
     */
    function estimarPorJcr(impactFactor) {
        const fi = parseFloat(impactFactor);
        if (isNaN(fi) || fi <= 0) {
            return { qualis: 'NC', quartil: 'none', estimado: false };
        }
        if (fi >= 4.0) {
            return { qualis: 'A1', quartil: 'Q1', estimado: true };
        } else if (fi >= 2.5) {
            return { qualis: 'A2', quartil: 'Q1', estimado: true };
        } else if (fi >= 1.5) {
            return { qualis: 'A3', quartil: 'Q2', estimado: true };
        } else if (fi >= 0.8) {
            return { qualis: 'A4', quartil: 'Q3', estimado: true };
        } else {
            return { qualis: 'B1', quartil: 'Q4', estimado: true };
        }
    }

    const JCRBibliometrics = {
        CORES_QUALIS: CORES_QUALIS,
        CORES_QUARTIL: CORES_QUARTIL,
        PONTOS_QUALIS: PONTOS_QUALIS,
        SEED_DATABASE: SEED_DATABASE,

        normalizarIssn: normalizarIssn,
        normalizarTitulo: normalizarTitulo,
        estimarPorJcr: estimarPorJcr,

        /**
         * Pontuação Qualis para cálculo de score de produção
         */
        qualisPontos: function (qualis) {
            const q = String(qualis || '').toUpperCase().trim();
            return PONTOS_QUALIS[q] !== undefined ? PONTOS_QUALIS[q] : 0;
        },

        /**
         * Cor hexadecimal para o badge do Qualis
         */
        qualisCor: function (qualis) {
            const q = String(qualis || '').toUpperCase().trim();
            return CORES_QUALIS[q] || CORES_QUALIS['NC'];
        },

        /**
         * Cor hexadecimal para o badge de Quartil
         */
        quartilCor: function (quartil) {
            const q = String(quartil || '').toUpperCase().trim();
            return CORES_QUARTIL[q] || CORES_QUARTIL['none'];
        },

        /**
         * Consulta métricas por ISSN e nome do periódico.
         */
        lookup: function (issn, journalName) {
            const cleanIssn = normalizarIssn(issn);

            // 1. Busca pelo ISSN no banco do usuário ou semente
            let entry = null;
            if (cleanIssn) {
                entry = customDatabase[cleanIssn] || SEED_DATABASE[cleanIssn];
            }

            // 2. Se não achou por ISSN, busca por título normalizado
            if (!entry && journalName) {
                const normJ = normalizarTitulo(journalName);
                if (normJ.length >= 4) {
                    // Verifica customDatabase
                    for (const k of Object.keys(customDatabase)) {
                        const it = customDatabase[k];
                        if (it.nome && normalizarTitulo(it.nome) === normJ) {
                            entry = it;
                            break;
                        }
                    }
                    // Verifica SEED_DATABASE
                    if (!entry) {
                        for (const k of Object.keys(SEED_DATABASE)) {
                            const it = SEED_DATABASE[k];
                            if (it.nome && normalizarTitulo(it.nome) === normJ) {
                                entry = it;
                                break;
                            }
                        }
                    }
                }
            }

            if (entry) {
                const q = entry.qualis || 'NC';
                const quart = entry.quartil || entry.quartilJcr || entry.quartilSjr || 'none';
                return {
                    issn: cleanIssn ? (cleanIssn.slice(0, 4) + '-' + cleanIssn.slice(4)) : (entry.issn || ''),
                    journalName: entry.nome || journalName || '',
                    qualis: q,
                    quartil: quart,
                    quartilJcr: entry.quartilJcr || null,
                    quartilSjr: entry.quartilSjr || null,
                    jcr: entry.jcr || null,
                    sjr: entry.sjr || null,
                    citeScore: entry.citeScore || null,
                    subarea: entry.subarea || '',
                    openAccess: !!entry.openAccess,
                    hIndex: entry.hIndex || null,
                    estimado: false
                };
            }

            return null;
        },

        /**
         * Carrega customizações salvas em chrome.storage.local
         */
        carregarCustomizado: function (callback) {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get([STORAGE_KEY], (res) => {
                    if (res && res[STORAGE_KEY]) {
                        customDatabase = res[STORAGE_KEY];
                    }
                    isLoaded = true;
                    if (typeof callback === 'function') callback(customDatabase);
                });
            } else {
                isLoaded = true;
                if (typeof callback === 'function') callback(customDatabase);
            }
        },

        /**
         * Importa linhas de CSV (Sucupira, SCImago, JCR) e persiste localmente
         */
        importarCSV: function (csvTexto, callback) {
            const linhas = String(csvTexto || "").split(/\r?\n/);
            if (linhas.length < 2) return 0;

            const sep = linhas[0].includes(';') ? ';' : ',';
            const cab = linhas[0].split(sep).map(c =>
                c.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/^["']|["']$/g, '')
            );

            let idxIssn = cab.findIndex(c => c.includes('issn'));
            let idxNome = cab.findIndex(c => c.includes('periodico') || c.includes('titulo') || c.includes('title') || c.includes('journal'));
            let idxQualis = cab.findIndex(c => c.includes('qualis') || c.includes('estrato'));
            let idxQuartil = cab.findIndex(c => c.includes('quartil') || c.includes('quartile'));
            let idxJcr = cab.findIndex(c => c.includes('jcr') || c.includes('jif') || c.includes('impact'));
            let idxSjr = cab.findIndex(c => c.includes('sjr'));
            let idxCs = cab.findIndex(c => c.includes('citescore') || c.includes('if2a'));
            let idxSub = cab.findIndex(c => c.includes('area') || c.includes('subarea') || c.includes('categoria'));

            let count = 0;
            for (let i = 1; i < linhas.length; i++) {
                const l = linhas[i].trim();
                if (!l) continue;
                const partes = l.split(sep).map(p => p.trim().replace(/^["']|["']$/g, ''));
                const rawIssn = idxIssn !== -1 ? partes[idxIssn] : '';
                const issn = normalizarIssn(rawIssn);
                if (!issn) continue;

                const item = customDatabase[issn] || {};
                if (idxNome !== -1 && partes[idxNome]) item.nome = partes[idxNome];
                if (idxQualis !== -1 && partes[idxQualis]) item.qualis = partes[idxQualis].toUpperCase();
                if (idxQuartil !== -1 && partes[idxQuartil]) item.quartil = partes[idxQuartil].toUpperCase();
                if (idxJcr !== -1 && partes[idxJcr]) {
                    const v = parseFloat(partes[idxJcr].replace(',', '.'));
                    if (!isNaN(v)) item.jcr = v;
                }
                if (idxSjr !== -1 && partes[idxSjr]) {
                    const v = parseFloat(partes[idxSjr].replace(',', '.'));
                    if (!isNaN(v)) item.sjr = v;
                }
                if (idxCs !== -1 && partes[idxCs]) {
                    const v = parseFloat(partes[idxCs].replace(',', '.'));
                    if (!isNaN(v)) item.citeScore = v;
                }
                if (idxSub !== -1 && partes[idxSub]) item.subarea = partes[idxSub];

                customDatabase[issn] = item;
                count++;
            }

            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set({ [STORAGE_KEY]: customDatabase }, () => {
                    if (typeof callback === 'function') callback(count);
                });
            } else if (typeof callback === 'function') {
                callback(count);
            }
            return count;
        }
    };

    // Auto-carrega armazenamento se no browser
    JCRBibliometrics.carregarCustomizado();

    raiz.JCRBibliometrics = JCRBibliometrics;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = JCRBibliometrics;
        module.exports.JCRBibliometrics = JCRBibliometrics;
    }

})(typeof window !== 'undefined' ? window : globalThis);
