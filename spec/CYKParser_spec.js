/*
    Unit test for CYKParser.js
    Copyright (C) 2015 Hugo W.L. ter Doest

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var settings = require('../config/Settings');
var fs = require('fs');

var GrammarParser = require('../lib/GrammarParser');

var ChartParsers = require('../index');
var parserFactory = new ChartParsers.ParserFactory();

var ItemFactory = require('../lib/ItemFactory');
var itemFactory = new ItemFactory();

var path = './spec/data/CFGChartParser/';
var lexicon_file = '';
var grammar_file = path + 'test_grammar_for_CYK.txt';

// Grammar (in ../data/test_grammar_for_CYK.txt)
//S  -> NP VP
//NP -> DET N
//NP -> NP PP
//PP -> P NP
//VP -> V NP
//VP -> VP PP

// Lexicon
//DET -> the
//NP -> I
//N -> man
//N -> telescope
//P -> with
//V -> saw
//N -> cat
//N -> dog
//N -> pig
//N -> hill
//N -> park
//N -> roof
//P -> from
//P -> on
//P -> in

describe('CYK Parser', function() {
  var grammar_text;
  it('should read a text file', function(done) {
    fs.readFile(grammar_file, 'utf8', function (error, text) {
      expect(text).toBeDefined();
      grammar_text = text;
      done();
    });
  });

  var grammar;
  it('should parse the text file with the grammar', function() {
    grammar = GrammarParser.parse(grammar_text);
  });

  it('should parse a sentence', function() {
    var tagged_sentence = [['I', 'NP'],
                           ['saw', 'V'],
                           ['the', 'DET'],
                           ['man', 'N'],
                           ['with', 'P'],
                           ['the', 'DET'],
                           ['telescope', 'N']];
    var N = tagged_sentence.length;
    var parser = parserFactory.createParser({
      grammar: grammar, 
      type: 'CYK',
      unification: false,
      listOfCategories: true});
    var chart = parser.parse(tagged_sentence);
    var parses = chart.fullParseItems(parser.grammar.getStartSymbol(), "cyk_item");
    expect(parses.length).toEqual(2);
    var expected_item = itemFactory.createItem({
      'type': 'CYK', 
      'rule': {'lhs': 'S', 'rhs': ['NP', 'VP']},
      'from': 0, 
      'to': 7
    });
    expect(parses[0].id, expected_item.id).toEqual(expected_item.id);
    expect(parses[1].id, expected_item.id).toEqual(expected_item.id);
  });
});