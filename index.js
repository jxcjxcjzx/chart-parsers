/*
    Index file
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

// This index.js exports the necessary classes for using unification-based
// chart parsers

var SignatureParser = require('./lib/SignatureParser');
var GrammarParser = require('./lib/GrammarParser');
var LexiconParser = require('./lib/LexiconParser');
var ParserFactory = require('./lib/ParserFactory');
var TypedFeatureStructure = require('./lib/TypedFeatureStructure');

module.exports.SignatureParser = SignatureParser;
module.exports.LexiconParser = LexiconParser;
module.exports.GrammarParser = GrammarParser;
module.exports.ParserFactory = ParserFactory;
module.exports.TypedFeatureStructure = TypedFeatureStructure;