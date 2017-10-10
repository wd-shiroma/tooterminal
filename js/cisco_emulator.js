let ModeManager = (function () {
    function ModeManager(elem) {
        this.element = elem;
        this.dataset = elem.dataset;
        this.parse('');
    }
    ModeManager.prototype.execute = function (line, term) {
        let parsed = this.parse(line);
        if (!parsed.is_parsed) {
            console.log("AnalyzeError: " + parsed.message);
            return parsed.code;
        }
        if (parsed.code == '1001') {
            return true;
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
    };
    ModeManager.prototype.getCompletion = function (line) {
        let cmd_list = this.result.cmd_list;
        let completion = [];
        for (let i = 0; i < cmd_list.length; i++) {
            completion.push(
                  cmd_list[i].type === 'paramater' ? ('<' + cmd_list[i].name + '>')
                : cmd_list[i].type === 'number'    ? ('[' + cmd_list[i].name + ']')
                : (cmd_list[i].name)
            );
        }
        //this.debug();
        return completion;
    };
    ModeManager.prototype.information = function (line) {
        //?を押された時の一覧を返す
        let cmd_list = this.parse(line).cmd_list;
        let information = ['Exec commands:'];
        let cmd_name;
        for (let i = 0; i < cmd_list.length; i++) {
            if (cmd_list[i].type == 'paramater') {
                cmd_name = ('<' + cmd_list[i].name + '>');
            }
            else if (cmd_list[i].type == 'number') {
                let max = parseInt(cmd_list[i].max);
                let min = parseInt(cmd_list[i].min);
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
        let cur_cmd = this.line_parsed[this.line_parsed.length - 1];
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
        this.line_parsed = [];
        this.is_parsed = true;
        this.err_code = 0x0000;
        this.err_msg = "";
        this.position = position;
        this.completion = "";
        this.cmd_list = this.dataset;
        this.paramaters = {};
        this.optional = {};
        let i  = 0;
        let i2 = 0;
        let p  = "";
        let stored = "";
        let quate = '';
        /* 解析前処理 */
        if (line.length <= 0) {
            return this.result;
        }
        else if (line.match(/^\s*!/)) {
            this.is_parsed = true;
            this.err_code = 0x1001;
            this.err_msg = "comment";
            return this.result;
        }
        /* 解析メイン */
        for (i = this.position; i <= line.length; i++) {
            p = line.charAt(i);
            if (p === " " && quate === '') {
                stored = "";
                quate = "";
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
            stored += p;
            let is_quate = stored.match(/^(?:(')[^']+|(")[^"]+)$/);
            if (is_quate) {
                quate =
                    is_quate[1] ? '\'' :
                    is_quate[2] ? '"' : '';
            }
            else {
                quate = '';
            }
            let filter = [];
            for (var j = 0; j < this.cmd_list.length; j++) {
                if (this.cmd_list[j].type === "command") {
                    let reg = new RegExp("^" + stored, "i");
                    if (this.cmd_list[j].name.match(reg)) {
                        filter.push(this.cmd_list[j]);
                    }
                }
                else if (this.cmd_list[j].type === "number") {
                    let num = parseInt(stored);
                    let max = parseInt(this.cmd_list[j].max);
                    let min = parseInt(this.cmd_list[j].min);

                    if (stored.length === 0) {
                        this.cmd_list[j].param = parseInt(stored);
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
                        this.cmd_list[j].param = parseInt(stored);
                        filter.push(this.cmd_list[j]);
                    }
                }
                else if (this.cmd_list[j].type === "paramater") {
                    //1ブロックまたはクォーテーションで囲まれた範囲をパラメータとして処理する。
                    let re = new RegExp('^["\']?(.*?)["\']?$');
                    this.cmd_list[j].param = stored.replace(re, '$1');
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
                let spacer;
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
            for (let i = 0; i < this.line_parsed.length; i++) {
                if (this.line_parsed[i].type === 'paramater'
                    || this.line_parsed[i].type === 'number'
                ){
                    this.paramaters[this.line_parsed[i].name] = this.line_parsed[i].param;
                }
                if (this.line_parsed[i].hasOwnProperty('optional')) {
                    this.optional[this.line_parsed[i].optional] = true;
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
                let last = this.line_parsed[this.line_parsed.length - 1];
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


let ConfigManager = (function () {
    function ConfigManager(def, start) {
        this.default = JSON.parse(JSON.stringify(def));
        this.config = !start ? def : start;
        this.config = Object.assign(def, this.config);
    }

    ConfigManager.prototype.find = function (nodes) {
        if (typeof nodes === 'string') {
            nodes = nodes.split('.');
        }
        if (!Array.isArray(nodes)) {
            return undefined;
        }
        let cf = this.config;
        for (let i = 0; i < nodes.length; i++) {
            if (typeof cf[nodes[i]] !== 'undefined') {
                cf = cf[nodes[i]];
            }
            else {
                cf = undefined;
                break;
            }
        }
        if (typeof cf !== 'undefined') {
            return cf;
        }

        cf = this.default;
        for (let i = 0; i < nodes.length; i++) {
            cf = cf[nodes[i]];
            if (typeof cf === 'undefined') {
                break;
            }
        }
        return cf;
    };

    ConfigManager.prototype.write = function(nodes, param) {
        if (typeof nodes === 'string') {
            nodes = nodes.split('.');
        }
        if (!Array.isArray(nodes)) {
            return false;
        }
        let cf = this.config;
        let child;
        for (let i = 0; i < nodes.length - 1; i++) {
            child = nodes[i];
            if (typeof cf[child] === 'undefined') {
                cf[child] = {};
            }
            cf = cf[child];
        }
        child = nodes.pop();
        cf[child] = param;
        return true;
    }

    ConfigManager.prototype.erase = function(nodes) {
        if (typeof nodes === 'string') {
            nodes = nodes.split('.');
        }
        if (!Array.isArray(nodes)) {
            return false;
        }
        let cf = this.config;
        let child;
        for (let i = 0; i < nodes.length - 1; i++) {
            child = nodes[i];
            if (typeof cf[child] === 'undefined') {
                return true;
            }
            cf = cf[child];
        }
        child = nodes.pop();
        delete(cf[child]);
        return true;
    }

    return ConfigManager;
}());

let InstanceManager = (function () {
    function InstanceManager() {
        let ins_str = localStorage.getItem('instances');
        if (ins_str) {
            this.instances = JSON.parse(ins_str);
            this.parse_acl();
        }
        else {
            this.instances = {};
        }
        this._ins = undefined;
        this._name = '';
    }

    InstanceManager.prototype.parse_acl = function () {
        this.acls = {};
        for (let ins_name in this.instances) {
            this.acls[ins_name] = {};
            if (!this.instances[ins_name].hasOwnProperty('acl')) {
                continue;
            }
            for (let acl_num in this.instances[ins_name].acl) {
                let acl = this.instances[ins_name].acl[acl_num];
                let color = acl.color ? acl.color : 'dark-blue';
                let filter = acl.regexp;
                let filter_r = filter.match(/^\/(.+)\/([igym]*)$/);
                let re;
                if (filter_r) {
                    re = new RegExp(filter_r[1], filter_r[2])
                }
                else {
                    re = new RegExp(filter);
                }
                this.acls[ins_name][acl_num] = {
                    type: acl.type,
                    regexp: re,
                    color: color
                };
            }
        }
    }

    InstanceManager.prototype.name = function (name) {
        if (typeof name === 'string') {
            this._name = name;
            this._ins = this.instances[name];
        }
        return this._name;
    }

    InstanceManager.prototype.save = function () {
        for (let _ins in this.instances) {
            if (!this.instances[_ins].hasOwnProperty('client_id')) {
                delete(this.instances[_ins]);
            }
        }
        let ins_str = JSON.stringify(this.instances);
        localStorage.setItem('instances', ins_str);
        return true;
    }

    InstanceManager.prototype.get = function (name) {
        if (typeof name === 'undefined') {
            return this._ins;
        }
        else {
            return this.instances[name];
        }
    }

    InstanceManager.prototype.set = function (ins, name) {
        if (typeof name === 'undefined') {
            name = this.name();
        }
        if (!name) {
            return false;
        }
        this.instances[name] = ins;
        this._ins = ins;
        this.save();
    }

    InstanceManager.prototype.delete = function (name) {
        if (typeof name === 'undefined') {
            name = this._name;
        }
        result = delete(this.instances[name]);
        if (result) {
            this._name = '';
            this._ins = undefined;
        }
        this.save();
        return result;
    }

    InstanceManager.prototype.create = function (name) {
        if (!this.instances.hasOwnProperty(name)) {
            this.instances[name] = {};
            this.name(name);
        }
        return this.instances[name];
    }

    return InstanceManager;
}());