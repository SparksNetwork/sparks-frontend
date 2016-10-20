/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { WebUrl } from './WebUrl';

describe(`domain/models/WebUrl`, () => {
  it(`should be a function`, () => {
    assert.equal(typeof WebUrl, `function`);
  });

  it(`should accept a valid URL string`, () => {
    assertUrl('http://foo.com/blah_blah');
    assertUrl('http://foo.com/blah_blah/');
    assertUrl('http://foo.com/blah_blah_(wikipedia)');
    assertUrl('http://foo.com/blah_blah_(wikipedia)_(again)');
    assertUrl('http://www.example.com/wpstyle/?p=364');
    assertUrl('https://www.example.com/foo/?bar=baz&inga=42&quux');
    assertUrl('http://✪df.ws/123');
    assertUrl('http://userid:password@example.com:8080');
    assertUrl('http://userid:password@example.com:8080/');
    assertUrl('http://userid@example.com');
    assertUrl('http://userid@example.com/');
    assertUrl('http://userid@example.com:8080');
    assertUrl('http://userid@example.com:8080/');
    assertUrl('http://userid:password@example.com');
    assertUrl('http://userid:password@example.com/');
    assertUrl('http://142.42.1.1/');
    assertUrl('http://142.42.1.1:8080/');
    assertUrl('http://➡.ws/䨹');
    assertUrl('http://⌘.ws');
    assertUrl('http://⌘.ws/');
    assertUrl('http://foo.com/blah_(wikipedia)#cite-1');
    assertUrl('http://foo.com/blah_(wikipedia)_blah#cite-1');
    assertUrl('http://foo.com/unicode_(✪)_in_parens');
    assertUrl('http://foo.com/(something)?after=parens');
    assertUrl('http://☺.damowmow.com/');
    assertUrl('http://code.google.com/events/#&product=browser');
    assertUrl('http://j.mp');
    assertUrl('ftp://foo.bar/baz');
    assertUrl('http://foo.bar/?q=Test%20URL-encoded%20stuff');
    assertUrl('http://مثال.إختبار');
    assertUrl('http://例子.测试');
    assertUrl('http://उदाहरण.परीक्षा');
    assertUrl("http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com");
    assertUrl('http://1337.net');
    assertUrl('http://a.b-c.de');
  });

  it(`should throw, given an invalid URL string`, () => {
    assert.throws(() => new WebUrl('http://'));
    assert.throws(() => new WebUrl('http://.'));
    assert.throws(() => new WebUrl('http://..'));
    assert.throws(() => new WebUrl('http://../'));
    assert.throws(() => new WebUrl('http://?'));
    assert.throws(() => new WebUrl('http://??'));
    assert.throws(() => new WebUrl('http://??/'));
    assert.throws(() => new WebUrl('http://#'));
    assert.throws(() => new WebUrl('http://##'));
    assert.throws(() => new WebUrl('http://##/'));
    assert.throws(() => new WebUrl('http://foo.bar?q=Spaces should be encoded'));
    assert.throws(() => new WebUrl('//'));
    assert.throws(() => new WebUrl('//a'));
    assert.throws(() => new WebUrl('///a'));
    assert.throws(() => new WebUrl('///'));
    assert.throws(() => new WebUrl('http:///a'));
    assert.throws(() => new WebUrl('foo.com'));
    assert.throws(() => new WebUrl('rdar://1234'));
    assert.throws(() => new WebUrl('h://test'));
    assert.throws(() => new WebUrl('http:// shouldfail.com'));
    assert.throws(() => new WebUrl(':// should fail'));
    assert.throws(() => new WebUrl('http://foo.bar/foo(bar)baz quux'));
    assert.throws(() => new WebUrl('ftps://foo.bar/'));
    assert.throws(() => new WebUrl('http://-error-.invalid/'));
    // assert.throws(() => new Url('http://a.b--c.de/'));
    assert.throws(() => new WebUrl('http://-a.b.co'));
    assert.throws(() => new WebUrl('http://a.b-.co'));
    assert.throws(() => new WebUrl('http://0.0.0.0'));
    assert.throws(() => new WebUrl('http://224.1.1.1'));
    assert.throws(() => new WebUrl('http://1.1.1.1.1'));
    assert.throws(() => new WebUrl('http://123.123.123'));
    assert.throws(() => new WebUrl('http://3628126748'));
    assert.throws(() => new WebUrl('http://.www.foo.bar/'));
    // assert.throws(() => new Url('http://www.foo.bar./'));
    assert.throws(() => new WebUrl('http://.www.foo.bar./'));

    assert.throws(() => new WebUrl(`http://10.1.1.1`));
    assert.throws(() => new WebUrl(`http://10.1.1.254`));
    assert.throws(() => new WebUrl(`http://127.1.1.1`));
    assert.throws(() => new WebUrl(`http://127.1.1.254`));
    assert.throws(() => new WebUrl(`http://169.254.1.1`));
    assert.throws(() => new WebUrl(`http://169.254.1.254`));
    assert.throws(() => new WebUrl(`http://192.168.1.1`));
    assert.throws(() => new WebUrl(`http://192.168.1.254`));
    assert.throws(() => new WebUrl(`http://172.16.1.1`));
    assert.throws(() => new WebUrl(`http://172.16.1.254`));
    assert.throws(() => new WebUrl(`http://172.31.1.1`));
    assert.throws(() => new WebUrl(`http://172.31.1.254`));
    // assert.throws(() => new Url(`http://223.255.255.254`));
    assert.throws(() => new WebUrl(`http://localhost`));
    assert.throws(() => new WebUrl(`http://localhost/`));
    assert.throws(() => new WebUrl(`http://localhost:8080/`));
    assert.throws(() => new WebUrl(`http://localhost:8080/endpoint`));
  });

  it(`should return false when calling isMissing()`, () => {
    const sut = sutFixture();
    assert.ok(!sut.isMissing());
  });

  it(`should return MissingWebUrl instance when calling missingWebUrl()`, () => {
    const missingWebUrl = WebUrl.missingWebUrl();
    assert.strictEqual((missingWebUrl.constructor as any).name, `MissingWebUrl`)
  })
});

function sutFixture(url: string = `http://www.foo.bar`) {
  return new WebUrl(url);
}

function assertUrl(url: string) {
  const sut = sutFixture(url);
  assert.strictEqual(sut.value(), url);
}