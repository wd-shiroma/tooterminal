var ModeManager = (function () {
    function ModeManager(elem) {
        this.element = elem;
        this.dataset = elem.dataset;
        this.parse('');
    }
    ModeManager.prototype.execute = function (line, term) {
        var parsed = this.parse(line);
        if (!parsed.is_parsed) {
            console.log("AnalyzeError: " + parsed.message);
            return parsed.code;
        }
        if (this.func_name === "") {
            console.log("AnalyzeError: Undefined execution function name.");
            return 0x2F01;
        }
        if (typeof parsed.cmd_list[0].execute !== "function") {
            console.log("ElementError: Undefined execution function.");
            return 0x2F02;
        }
        return parsed.cmd_list[0].execute(term, this);
        //return eval("this.element." + this.func_name + "();");
    };
    ModeManager.prototype.getCompletion = function (line) {
        var cmd_list = this.result.cmd_list;
        var completion = [];
        for (var i = 0; i < cmd_list.length; i++) {
            completion.push(
                  cmd_list[i].type == 'paramater' ? ('<' + cmd_list[i].name + '>')
                : cmd_list[i].type == 'number'    ? ('[' + cmd_list[i].name + ']')
                : (cmd_list[i].name)
            );
        }
        //this.debug();
        return completion;
    };
    ModeManager.prototype.information = function (line) {
        //?を押された時の一覧を返す
        var cmd_list = this.parse(line).cmd_list;
        var information = ['Exec commands:'];
        var cmd_name;
        for (var i = 0; i < cmd_list.length; i++) {
            if (cmd_list[i].type == 'paramater') {
                cmd_name = ('<' + cmd_list[i].name + '>');
            }
            else if (cmd_list[i].type == 'number') {
                var max = parseInt(cmd_list[i].max);
                var min = parseInt(cmd_list[i].min);
                cmd_name = ('<' + (isNaN(min) ? '' : min) + '-' + (isNaN(max) ? '' : max) + '>');
            }
            else {
                cmd_name = cmd_list[i].name;
            }
            information.push({
                command: cmd_name,
                description: cmd_list[i].description
            });
        }
        var cur_cmd = this.line_parsed[this.line_parsed.length - 1];
        if (typeof cur_cmd !== 'undefined'
            && typeof cur_cmd.execute === 'function'
            && cur_cmd.type !== 'paramater'
            && cur_cmd.type !== 'number'
        ) {
            if (information.length === 2) {
                information.pop();
            }
            information.push({
                command: '<cr>',
                description: ''
            });
        }
        return information;
    };
    /*
    Object.defineProperty(ModeManager.prototype, "lineanalyzer", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });*/
    /**
     * コマンドラインを解析する
     * @param {String} line パーサの対象となる文字列
     * @param {Number} position 現在の読み取り位置
     * @return {Array} 成功したかどうか、パース結果、新しい読み取り位置の３つの要素を持った配列
     */
    ModeManager.prototype.parse = function (line, position) {
        if (position === void 0) { position = 0; }
        /* 初期化 */
        this.line = line;
        this.line_split = line.replace(/ +/g, ' ',).split(' ')
        this.line_parsed = [];
        this.is_parsed = true;
        this.err_code = 0x0000;
        this.err_msg = "";
        this.position = position;
        this.completion = "";
        this.cmd_list = this.dataset;
        this.paramaters = {};
        var i  = 0;
        var i2 = 0;
        var p  = "";
        var stored = "";
        /* 解析前処理 */
        if (line.length <= 0) {
            return this.result;
        }
        else if (line.match(/^!/)) {
            this.is_parsed = false;
            this.err_code = 0x1001;
            this.err_msg = "comment";
            return this.result;
        }
        /* 解析メイン */
        for (i = this.position; i <= line.length; i++) {
            p = line.charAt(i);
            if (p === " ") {
                stored = "";
                while (1) {
                    p = line.charAt(++i);
                    if (p !== " " || p === "")
                        break;
                }
                this.completion = line.substring(0, i);
                if (this.cmd_list.length === 1) {
                    this.line_parsed.push(this.cmd_list[0]);
                    this.cmd_list = (typeof this.cmd_list[0].children === "object")
                        ? this.cmd_list[0].children
                        : [];
                }
                else if (this.cmd_list.length > 1) {
                    this.err_code = 0x1F02;
                    this.err_msg = "% Ambiguous command:  \"" + this.line + "\"";
                    break;
                }
            }
            if (p === "") {
                break;
            }
            stored += p;
            /*ここら辺にクォーテーションで囲まれたものをパラメータとする処理を書く*/
            var filter = [];
            for (var j = 0; j < this.cmd_list.length; j++) {
                if (this.cmd_list[j].type === "command") {
                    var reg = new RegExp("^" + stored, "i");
                    if (this.cmd_list[j].name.match(reg)) {
                        filter.push(this.cmd_list[j]);
                    }
                }
                else if (this.cmd_list[j].type === "number") {
                    var num = parseInt(stored);
                    var max = parseInt(this.cmd_list[j].max);
                    var min = parseInt(this.cmd_list[j].min);

                    if (stored.length === 0) {
                        filter.push(this.cmd_list[j]);
                    }
                    else if (isNaN(num)) {
                        continue;
                    }
                    else if (!isNaN(max) && max < num) {
                        continue;
                    }
                    else if (!isNaN(min) && min > num) {
                        continue;
                    }
                    else {
                        filter.push(this.cmd_list[j]);
                    }
                }
                else if (this.cmd_list[j].type === "paramater") {
                    //1ブロックまたはクォーテーションで囲まれた範囲をパラメータとして処理する。
                    filter.push(this.cmd_list[j]);
                }
                else if (this.cmd_list[j].type === "description") {
                    if (this.cmd_list.length === 1) {
                        i = line.length;
                        break;
                    }
                }
                else {
                    /* 想定外エラー：datasetに適切なtype設定がない */
                    this.err_code = 0xF001;
                    this.err_msg = "parsed error: undefined type '" + this.cmd_list[j].type + "'";
                    return this.result;
                }
            }
            this.cmd_list = filter;
            if (this.cmd_list.length === 0) {
                this.is_parsed = false;
                this.err_code = 0x1F01;
                var spacer;
                for (spacer = ''; spacer.length < i; spacer += ' ');
                spacer += $.terminal.active().get_prompt().replace(/\S/g, ' ');
                this.err_msg = spacer + "^\n% Invalid input detected at '^' marker.";
                this.cmd_list = [];
                break;
            }
        }
        /* 解析後処理 */
        this.position = i;
        if (this.cmd_list.length === 1) {
            this.line_parsed.push(this.cmd_list[0]);
            if (typeof this.cmd_list[0].execute === "undefined") {
                this.is_parsed = false;
                this.err_code = 0x1101;
                this.err_msg = "% Incomplete command.";
            }
            for (var i = 0; i < this.line_parsed.length; i++) {
                if (this.line_parsed[i].type === 'paramater'
                    || this.line_parsed[i].type === 'number'
                ){
                    this.paramaters[this.line_parsed[i].name] = this.line_split[i];
                }
            }
        }
        if (this.cmd_list.length === 1 && this.cmd_list[0].type === "command") {
            this.completion += this.cmd_list[0].name + " ";
        }
        else {
            this.completion = this.line;
        }
        return this.result;
    };
    Object.defineProperty(ModeManager.prototype, "func_name", {
        get: function () {
            if (this.err_code !== 0) {
                return "";
            }
            else {
                var last = this.line_parsed[this.line_parsed.length - 1];
                return (typeof last.execute === "undefined")
                    ? ""
                    : last.execute;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModeManager.prototype, "result", {
        get: function () {
            return {
                is_parsed: this.is_parsed,
                cmd_list: this.cmd_list,
                code: this.err_code.toString(16),
                message: this.err_msg,
                position: this.position,
                line_parsed: this.line_parsed
            };
        },
        enumerable: true,
        configurable: true
    });
    ModeManager.prototype.debug = function () {
        console.log("**************************************************");
        console.log("===== line");
        console.log(this.line);
        console.log("===== line_parsed");
        console.log(this.line_parsed);
        console.log("===== is_parsed");
        console.log(this.is_parsed);
        console.log("===== err_code");
        console.log(this.err_code.toString(16));
        console.log("===== err_msg");
        console.log(this.err_msg);
        console.log("===== line.length");
        console.log(this.line.length);
        console.log("===== position");
        console.log(this.position);
        console.log("===== completion");
        console.log(this.completion);
        console.log("===== dataset");
        console.log(this.dataset);
        console.log("===== cmd_list");
        console.log(this.cmd_list);
    };
    return ModeManager;
}());


var ConfigManager = (function () {
    function ConfigManager(conf) {
        this.config = conf;
    }

    ConfigManager.prototype.getConfig = function (line) {
        var cmd_list = this.result.cmd_list;
        var completion = [];
        for (var i = 0; i < cmd_list.length; i++) {
            completion.push(
                  cmd_list[i].type == 'paramater' ? ('<' + cmd_list[i].name + '>')
                : cmd_list[i].type == 'number'    ? ('[' + cmd_list[i].name + ']')
                : (cmd_list[i].name)
            );
        }
        //this.debug();
        return completion;
    };
    return ModeManager;
}());
