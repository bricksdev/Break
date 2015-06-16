/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Localized = require('../lib/nationalized');
var localutil = require('../lib/localutils');
var swig = require('swig'),
        should = require('should');




describe('Nationalization:  Localized', function () {

    describe('Localized', function () {

        it("Locatized templates by extend swig custom tag", function (done) {
            Localized.extend(swig);
            var tpl = "{% i18n key %}";
            var locals = {key: "001"};
            var relt = swig.render(tpl);

            relt.should.equal("001");
            done();
        });
        it("normal swig render by base tag", function (done) {
            Localized.extend(swig);
            var locals = {mystuff: function mystuff() {
                    return '<p>Things!</p>';
                }};
            var relt = swig.render('{{ mystuff() }}', {locals: locals});

            relt.should.equal("<p>Things!</p>");
            done();
        });
    });

    describe('Localized: init', function () {

        it("Load locales files ", function (done) {
            //req.headers['accept-language']
            // // pl,fr-FR;q=0.3,en-US;q=0.1
            localutil.parse();
            localutil.setLocal("zh-CN,fr-FR;q=0.3,en-US;q=0.1");
            var message = localutil.error("key001",{p2:"成功",p1:"key001"});
            message.should.equal("key001:国际化测试替换key001成功");
            done();
        });
    });
});

