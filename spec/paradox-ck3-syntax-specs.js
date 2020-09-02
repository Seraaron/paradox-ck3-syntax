describe("CK3 grammar", function() {
  var grammar = null;
  var root = "source.ck3"; // defined here to allow painless changes (and reduce typing)

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage("paradox-ck3-syntax");
    });

    runs(() => {
      grammar = atom.grammars.grammarForScopeName(root);
    });
  });

  it("parses the grammar", () => {
    expect(grammar).toBeTruthy();
    expect(grammar.scopeName).toBe(root);
  });

  it("is configured correctly", () => {
    expect(grammar.maxLineLength).toBe(Infinity);
  });

  it("tokenizes spaces", () => {
    let tokens = grammar.tokenizeLine(" ").tokens;
    expect(tokens[0]).toEqual({value: " ", scopes:[root]});
  });

  it("tokenizes comments", () => {
    let tokens = grammar.tokenizeLine("# comment").tokens;
    expect(tokens[0]).toEqual({value: "#", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "punctuation.definition.comment.number-sign.ck2"]});
  });

  it("tokenizes validator commands in comments", () => {
    let tokens = grammar.tokenizeLine("# Audax Validator EnableCommentMetadata").tokens;
    expect(tokens[0]).toEqual({value: "#", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "keyword.control.directive.validator.number-sign.ck2"]});
    expect(tokens[1]).toEqual({value: " ", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2"]});
    expect(tokens[2]).toEqual({value: "Audax Validator", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "keyword.control.directive.validator.ck2"]});
    expect(tokens[3]).toEqual({value: " ", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2"]});
    expect(tokens[4]).toEqual({value: "EnableCommentMetadata", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "variable.parameter.validator.metaData.ck2"]});
  });

  it("tokenizes codetags in comments", () => {
    let tokens = grammar.tokenizeLine("# TODO").tokens;
    expect(tokens[0]).toEqual({value: "#", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "punctuation.definition.comment.number-sign.ck2"]});
    expect(tokens[1]).toEqual({value: " ", scopes:[root, 'comment.line.number-sign.ck2', "meta.comment.line.number-sign.ck2"]});
    expect(tokens[2]).toEqual({value: "TODO", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "storage.type.class.codetag", "entity.name.codetag.TODO", "entity.type.codetag.todo"]});
  });

  it("tokenizes codetag synonyms in comments", () => {
    let tokens = grammar.tokenizeLine("# DONE").tokens;
    expect(tokens[0]).toEqual({value: "#", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "punctuation.definition.comment.number-sign.ck2"]});
    expect(tokens[1]).toEqual({value: " ", scopes:[root, 'comment.line.number-sign.ck2', "meta.comment.line.number-sign.ck2"]});
    expect(tokens[2]).toEqual({value: "DONE", scopes:[root, "comment.line.number-sign.ck2", "meta.comment.line.number-sign.ck2", "storage.type.class.codetag", "entity.name.codetag.DONE", "entity.type.codetag.todo"]});
  });

  it("tokenizes double quoted strings", () => {
    let tokens = grammar.tokenizeLine('"x"').tokens;
    expect(tokens[0]).toEqual({value: '"', scopes:[root, "string.quoted.double.ck2", "punctuation.definition.string.begin.double.quote.ck2"]});
    expect(tokens[1]).toEqual({value: "x", scopes:[root, "string.quoted.double.ck2"]});
    expect(tokens[2]).toEqual({value: '"', scopes:[root, "string.quoted.double.ck2", "punctuation.definition.string.end.double.quote.ck2"]});
  });

  it("tokenizes escape characters in strings", () => {
    let tokens = grammar.tokenizeLine('"\\x"').tokens;
    expect(tokens[0]).toEqual({value: '"', scopes:[root, "string.quoted.double.ck2", "punctuation.definition.string.begin.double.quote.ck2"]});
    expect(tokens[1]).toEqual({value: "\\", scopes:[root, "string.quoted.double.ck2", "constant.character.escape.ck2", "punctuation.definition.escape.slash.back.ck2"]});
    expect(tokens[2]).toEqual({value: "x", scopes:[root, "string.quoted.double.ck2", "constant.character.escape.ck2"]});
    expect(tokens[3]).toEqual({value: '"', scopes:[root, "string.quoted.double.ck2", "punctuation.definition.string.end.double.quote.ck2"]});
  });

  it("tokenizes single quoted strings", () => {
    let tokens = grammar.tokenizeLine("'x'").tokens;
    expect(tokens[0]).toEqual({value: "'", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.string.begin.single.quote.ck2"]});
    expect(tokens[1]).toEqual({value: "x", scopes:[root, "string.quoted.single.ck2"]});
    expect(tokens[2]).toEqual({value: "'", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.string.end.single.quote.ck2"]});
  });

  it("tokenizes localisation keys", () => {
    let tokens = grammar.tokenizeLine("[x]").tokens;
    expect(tokens[0]).toEqual({value: "[", scopes:[root, "punctuation.definition.loc_key.begin.bracket.square.ck2"]});
    expect(tokens[1]).toEqual({value: "x", scopes:[root, "string.interpolated.loc_key.ck2", "entity.name.tag.loc_key.ck2"]});
    expect(tokens[2]).toEqual({value: "]", scopes:[root, "punctuation.definition.loc_key.end.bracket.square.ck2"]});
  });

  it("tokenizes localisation keys inside strings", () => {
    let tokens = grammar.tokenizeLine("'[x]'").tokens;
    expect(tokens[0]).toEqual({value: "'", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.string.begin.single.quote.ck2"]});
    expect(tokens[1]).toEqual({value: "[", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.loc_key.begin.bracket.square.ck2"]});
    expect(tokens[2]).toEqual({value: "x", scopes:[root, "string.quoted.single.ck2", "string.interpolated.loc_key.ck2", "entity.name.tag.loc_key.ck2"]});
    expect(tokens[3]).toEqual({value: "]", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.loc_key.end.bracket.square.ck2"]});
    expect(tokens[4]).toEqual({value: "'", scopes:[root, "string.quoted.single.ck2", "punctuation.definition.string.end.single.quote.ck2"]});
  });

  it("tokenizes the always keyword", () => {
    let tokens = grammar.tokenizeLine("always").tokens;
    expect(tokens[0]).toEqual({value: "always", scopes: [root, "constant.language.bool.true.always.ck2"]});
  });

});
