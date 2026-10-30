import type { Story } from './stories';
export const additionalStories: Story[] = [
  {
    "id": "1EMA",
    "title": "Green fluorescent protein",
    "subtitle": "GFP \u00b7 a light-emitting protein",
    "category": "FLUORESCENCE",
    "caveat": "The colors identify components; they do not simulate fluorescence. This entry contains selenomethionine. Model 1 \u00b7 deposited coordinates.",
    "components": {
      "barrel": {
        "name": "Protein fold \u00b7 A",
        "color": 5298626,
        "kind": "cartoon",
        "chains": [
          "A"
        ]
      },
      "chromo": {
        "name": "Chromophore \u00b7 A66",
        "color": 16761198,
        "kind": "ball-and-stick",
        "chains": [
          "A"
        ],
        "residues": [
          66
        ],
        "compounds": [
          "CRO"
        ]
      },
      "near": {
        "name": "Arginine \u00b7 A96",
        "color": 9606382,
        "kind": "ball-and-stick",
        "chains": [
          "A"
        ],
        "residues": [
          96
        ]
      }
    },
    "stops": [
      {
        "title": "A fluorescent fold",
        "text": "Green fluorescent protein from the jellyfish Aequorea victoria encloses a chromophore inside a barrel-like protein fold. This is a coordinate model, not a picture of emitted light.",
        "focus": "all",
        "visible": [
          "barrel",
          "chromo"
        ]
      },
      {
        "title": "The chromophore",
        "text": "The modified residue CRO at author position A66 is the light-absorbing and light-emitting center. Isolate its atoms to see a structure that differs from an ordinary amino acid.",
        "focus": "chromo",
        "visible": [
          "chromo"
        ]
      },
      {
        "title": "Inside the barrel",
        "text": "Restore the surrounding fold and inspect arginine A96 alongside the chromophore. These are specific residues in the deposited model; no reaction is being animated.",
        "focus": "chromo",
        "visible": [
          "barrel",
          "chromo",
          "near"
        ]
      },
      {
        "title": "A protected center",
        "text": "Return to the whole fold. The protein surrounds its chromophore, an arrangement that underlies GFP\u2019s usefulness as a fluorescent marker in biological research.",
        "focus": "all",
        "visible": [
          "barrel",
          "chromo"
        ]
      }
    ]
  },
  {
    "id": "1LYZ",
    "title": "Lysozyme",
    "subtitle": "An enzyme \u00b7 a compact protein fold",
    "category": "ENZYME",
    "caveat": "No sugar substrate is present in this entry. Model 1 \u00b7 deposited coordinates.",
    "components": {
      "protein": {
        "name": "Lysozyme \u00b7 A",
        "color": 5298626,
        "kind": "cartoon",
        "chains": [
          "A"
        ]
      },
      "glu": {
        "name": "Glutamate \u00b7 A35",
        "color": 16761198,
        "kind": "ball-and-stick",
        "chains": [
          "A"
        ],
        "residues": [
          35
        ]
      },
      "asp": {
        "name": "Aspartate \u00b7 A52",
        "color": 9606382,
        "kind": "ball-and-stick",
        "chains": [
          "A"
        ],
        "residues": [
          52
        ]
      }
    },
    "stops": [
      {
        "title": "An enzyme in egg white",
        "text": "Hen egg-white lysozyme is an enzyme that breaks bonds in bacterial cell-wall carbohydrates. This structure shows the protein alone, without a bound sugar substrate.",
        "focus": "all",
        "visible": [
          "protein"
        ]
      },
      {
        "title": "Glutamate 35",
        "text": "Locate glutamate A35, one of the residues associated with lysozyme\u2019s catalytic site. Its atoms are shown as sticks against the folded protein.",
        "focus": "glu",
        "visible": [
          "protein",
          "glu"
        ]
      },
      {
        "title": "Two catalytic residues",
        "text": "Isolate glutamate A35 and aspartate A52 together. Both are present in the experimental coordinates; this view highlights their positions without inventing a substrate or a reaction.",
        "focus": "glu",
        "visible": [
          "glu",
          "asp"
        ]
      },
      {
        "title": "The folded enzyme",
        "text": "Restore the whole enzyme around the highlighted residues. The active site is part of a larger three-dimensional protein, not a separate molecular component.",
        "focus": "all",
        "visible": [
          "protein",
          "glu",
          "asp"
        ]
      }
    ]
  },
  {
    "id": "1EHZ",
    "title": "Transfer RNA",
    "subtitle": "tRNA \u00b7 an adaptor for translation",
    "category": "RNA",
    "caveat": "Yeast phenylalanine tRNA; no attached amino acid or ribosome is shown. Model 1 \u00b7 deposited coordinates.",
    "components": {
      "rna": {
        "name": "tRNA \u00b7 A",
        "color": 5298626,
        "kind": "cartoon",
        "chains": [
          "A"
        ]
      },
      "anticodon": {
        "name": "Anticodon \u00b7 A34\u201336",
        "color": 16761198,
        "kind": "ball-and-stick",
        "chains": [
          "A"
        ],
        "residues": [
          34,
          35,
          36
        ]
      },
      "end": {
        "name": "CCA end \u00b7 A74\u201376",
        "color": 9606382,
        "kind": "ball-and-stick",
        "chains": [
          "A"
        ],
        "residues": [
          74,
          75,
          76
        ]
      }
    },
    "stops": [
      {
        "title": "RNA beyond the double helix",
        "text": "This yeast phenylalanine transfer RNA folds into a compact three-dimensional shape. Transfer RNAs connect the genetic code to amino acids during protein synthesis.",
        "focus": "all",
        "visible": [
          "rna"
        ]
      },
      {
        "title": "Reading the code",
        "text": "The anticodon occupies author residues 34\u201336. This structure includes a modified guanosine at position 34, followed by adenine and adenine.",
        "focus": "anticodon",
        "visible": [
          "rna",
          "anticodon"
        ]
      },
      {
        "title": "The other end",
        "text": "The CCA sequence at residues 74\u201376 is at the amino-acid attachment end of tRNA. No amino acid is attached in the displayed model.",
        "focus": "end",
        "visible": [
          "rna",
          "end"
        ]
      },
      {
        "title": "One molecule, two roles",
        "text": "Restore the RNA with both regions marked. The anticodon and the CCA end occupy different regions of the folded molecule; a ribosome is not part of this entry.",
        "focus": "all",
        "visible": [
          "rna",
          "anticodon",
          "end"
        ]
      }
    ]
  },
  {
    "id": "1MBN",
    "title": "Myoglobin",
    "subtitle": "A heme protein \u00b7 oxygen in muscle",
    "category": "HEME PROTEIN",
    "caveat": "A historic sperm-whale myoglobin model. The heme is shown; no bound O2 molecule is added. Model 1 \u00b7 deposited coordinates.",
    "components": {
      "protein": {
        "name": "Myoglobin \u00b7 A",
        "color": 5298626,
        "kind": "cartoon",
        "chains": [
          "A"
        ]
      },
      "heme": {
        "name": "Heme \u00b7 A155",
        "color": 16761198,
        "kind": "ball-and-stick",
        "chains": [
          "A"
        ],
        "residues": [
          155
        ],
        "compounds": [
          "HEM"
        ]
      }
    },
    "stops": [
      {
        "title": "One chain around a heme",
        "text": "Myoglobin is an oxygen-binding protein found in muscle. Unlike the four-chain hemoglobin example, this deposited model has one protein chain around a heme group.",
        "focus": "all",
        "visible": [
          "protein",
          "heme"
        ]
      },
      {
        "title": "The heme group",
        "text": "Author residue A155 is the heme. Its ring surrounds an iron atom, providing a familiar chemical motif shared with hemoglobin.",
        "focus": "heme",
        "visible": [
          "heme"
        ]
      },
      {
        "title": "Protein around the cofactor",
        "text": "Restore the protein around the selected heme. The ribbon traces the folded protein backbone, while the sticks show the heme\u2019s atomic bonds.",
        "focus": "heme",
        "visible": [
          "protein",
          "heme"
        ]
      },
      {
        "title": "Compare the carriers",
        "text": "Return to the whole myoglobin fold, then compare it with hemoglobin in the collection. Similar cofactors can appear in proteins with different chain arrangements and biological roles.",
        "focus": "all",
        "visible": [
          "protein",
          "heme"
        ]
      }
    ]
  },
  {
    "id": "1F88",
    "title": "Rhodopsin",
    "subtitle": "A light receptor \u00b7 retinal in a pocket",
    "category": "RECEPTOR",
    "caveat": "Bovine rhodopsin crystal model. No membrane or light-triggered transition is simulated; glycans and crystallization additives are omitted from the tours. Model 1 \u00b7 deposited coordinates.",
    "components": {
      "a": {
        "name": "Receptor copy \u00b7 A",
        "color": 5298626,
        "kind": "cartoon",
        "chains": [
          "A"
        ]
      },
      "b": {
        "name": "Receptor copy \u00b7 B",
        "color": 9606382,
        "kind": "cartoon",
        "chains": [
          "B"
        ]
      },
      "retinal": {
        "name": "Retinal \u00b7 A977",
        "color": 16761198,
        "kind": "ball-and-stick",
        "chains": [
          "A"
        ],
        "residues": [
          977
        ],
        "compounds": [
          "RET"
        ]
      }
    },
    "stops": [
      {
        "title": "A receptor for light",
        "text": "Rhodopsin is a light-sensitive G protein-coupled receptor. This deposited crystal model contains two receptor copies; the two copies do not by themselves establish a functional dimer.",
        "focus": "all",
        "visible": [
          "a",
          "b",
          "retinal"
        ]
      },
      {
        "title": "One receptor copy",
        "text": "Isolate author chain A. Its helical fold surrounds the retinal-binding region. A lipid membrane is not included in this scene.",
        "focus": "a",
        "visible": [
          "a",
          "retinal"
        ]
      },
      {
        "title": "Meet retinal",
        "text": "Retinal is the small light-sensitive molecule in the receptor. This selection is author residue A977, identified as RET in the file. The static coordinates do not show photoisomerization.",
        "focus": "retinal",
        "visible": [
          "retinal"
        ]
      },
      {
        "title": "Retinal in its pocket",
        "text": "Restore chain A around retinal to see the relationship between the small chromophore and the much larger receptor.",
        "focus": "a",
        "visible": [
          "a",
          "retinal"
        ]
      }
    ]
  },
  {
    "id": "1BMF",
    "title": "ATP synthase: the F1 head",
    "subtitle": "F1-ATPase \u00b7 part of a rotary machine",
    "category": "MOLECULAR MACHINE",
    "caveat": "Only the soluble F1 portion is present, not the membrane motor. ANP is a nucleotide analogue, not ATP. Model 1 \u00b7 deposited coordinates.",
    "components": {
      "alpha": {
        "name": "Alpha subunits \u00b7 A\u2013C",
        "color": 5298626,
        "kind": "cartoon",
        "chains": [
          "A",
          "B",
          "C"
        ]
      },
      "beta": {
        "name": "Beta subunits \u00b7 D\u2013F",
        "color": 9606382,
        "kind": "cartoon",
        "chains": [
          "D",
          "E",
          "F"
        ]
      },
      "gamma": {
        "name": "Gamma subunit \u00b7 G",
        "color": 16761198,
        "kind": "cartoon",
        "chains": [
          "G"
        ]
      },
      "nucleotides": {
        "name": "ADP and ANP",
        "color": 16761198,
        "kind": "ball-and-stick",
        "chains": [
          "A",
          "B",
          "C",
          "D",
          "F"
        ],
        "compounds": [
          "ADP",
          "ANP"
        ]
      }
    },
    "stops": [
      {
        "title": "The head of a molecular machine",
        "text": "This bovine mitochondrial F1-ATPase structure contains three alpha and three beta subunits around a gamma subunit. It is the soluble portion of ATP synthase, not the complete membrane complex.",
        "focus": "all",
        "visible": [
          "alpha",
          "beta",
          "gamma",
          "nucleotides"
        ]
      },
      {
        "title": "The central subunit",
        "text": "Isolate the deposited gamma chain G. Its position within the larger complex helps explain why F1 is studied as part of a rotary molecular machine; no rotation is simulated here.",
        "focus": "gamma",
        "visible": [
          "gamma"
        ]
      },
      {
        "title": "Nucleotides in the structure",
        "text": "The file contains ADP in chain D and the analogue ANP in chains A, B, C, and F. These are distinct chemical identities; the analogue is not labeled as ATP.",
        "focus": "nucleotides",
        "visible": [
          "beta",
          "nucleotides"
        ]
      },
      {
        "title": "Put the head together",
        "text": "Restore the full deposited F1 complex. The three beta chains are not identical in their observed conformations or nucleotide occupancy, a central observation in the cited structural study.",
        "focus": "all",
        "visible": [
          "alpha",
          "beta",
          "gamma",
          "nucleotides"
        ]
      }
    ]
  }
];
