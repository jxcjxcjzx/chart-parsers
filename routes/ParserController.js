/*
    Some logic for loading grammar and parsing sentences
    Copyright (C) 2014 Hugo W.L. ter Doest

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

var formidable = require('formidable');

var Grammar = require('./ContextFreeGrammar');
var CFG = require('./CFG');
var CYK = require('./CYK');
var EarleyChartParser = require('./EarleyChartParser');
var pos = require('pos');
var grammar;

// Page for loading a grammar
exports.choose_grammar_file = function(req, res) {
  res.render('load_grammar');
};

// Submit a grammar file
exports.submit_grammar = function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var grammar_file = files.grammar_file.path + files.grammar_file.name;
    grammar = new CFG(files.grammar_file.path);
    res.redirect('/input_sentence');
  });
};

// Page for entering a sentence
exports.input_sentence = function(req, res) {
  res.render('parse_sentence');
};

// Parsing with the Earley algorithm
exports.parse_sentence_with_Earley = function(req, res) {
  var chart_Earley;
  var sentence;
  var start, end, accepted_Earley;
  var time_Earley;
  var complete_parse = {};

  sentence = req.param('input_sentence');
  var words = new pos.Lexer().lex(sentence);
  var taggedWords = new pos.Tagger().tag(words);
  var N = taggedWords.length;
  console.log('Tagged sentence: ' + taggedWords);
  
  start = new Date().getTime();
  chart_Earley = EarleyChartParser.earley_parse(taggedWords, grammar);
  end = new Date().getTime();
  console.log(end);
  time_Earley = end - start;
  console.log(chart_Earley);
  
  accepted_Earley = false;
  var keys_of_final_state = Object.keys(chart_Earley[N]);
  keys_of_final_state.forEach(function(key) {
    var item = chart_Earley[N][key];
    if ((item.rule.lhs === Grammar.start_symbol()) && (item.rule.rhs.length === item.dot)) {
      accepted_Earley = true;
      complete_parse = item;
    }
  });
  
  var nr_items = 0;
  chart_Earley.forEach(function(state) {
    nr_items += Object.keys(state).length;
  });

  res.render('parse_result_Earley', {chart_Earley: chart_Earley,
                                     parsing_time_Earley: time_Earley,
                                     in_language_Earley: accepted_Earley,
                                     N: N,
                                     tagged_sentence: taggedWords,
                                     parse: complete_parse,
                                     nr_items_created: nr_items});
};

// Parsing with the CYK parser
exports.parse_sentence_with_CYK = function(req, res) {
  var chart_CYK;
  var sentence;
  var start, end, accepted_CYK;
  var time_CYK;

  sentence = req.param('input_sentence');
  var words = new pos.Lexer().lex(sentence);
  var taggedWords = new pos.Tagger().tag(words);
  var N = taggedWords.length;
  console.log(taggedWords);
  
  // CYK
  start = new Date().getTime();
  chart_CYK = CYK.CYK_Chart_Parser(taggedWords, grammar);
  end = new Date().getTime();
  time_CYK = end - start;
  console.log(chart_CYK);
  accepted_CYK = chart_CYK[N - 1][0] ? (chart_CYK[N - 1][0].indexOf(grammar.get_start_symbol()) !== -1) : false;
  console.log(accepted_CYK);
  res.render('parse_result_CYK', {chart_CYK: chart_CYK,
                                  parsing_time_CYK: time_CYK,
                                  in_language_CYK: accepted_CYK,
                                  N: N,
                                  sentence: taggedWords });
};

//Generic handler for parsing a sentence
exports.parse_sentence = function(req, res) {
  if (req.param("op_CYK")) {
    res.redirect('/parse_sentence_with_CYK?input_sentence=' + req.param('input_sentence'));
  }
  else {
    if (req.param("op_Earley")) {
      res.redirect('/parse_sentence_with_Earley?input_sentence=' + req.param('input_sentence'));
    }
  }
};
