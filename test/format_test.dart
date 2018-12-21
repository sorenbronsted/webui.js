
import "package:load/load.dart";
import 'package:intl/intl.dart';
import 'package:intl/date_symbol_data_local.dart';
import "../lib/src/ui/Formatter.dart";

void main() {
  initializeDateFormatting("da_DK", null);
  Intl.defaultLocale = 'da_DK';

  test("Integer load", () {
    var fixtures = {
      '1':'1',
      '1122': '1.122',
    };
    fixtures.forEach((source, result) {
      var test = Formatter.display('number', source, '#,##0');
      expect(test, result);
      test = Formatter.internal('number', test, '#,##0');
      expect(test, source);
    });
  });

  test("Decimal load", () {
    var fixtures = {
      '1.2':'1,20',
      '1120.23':'1.120,23',
    };
    fixtures.forEach((source, result) {
      var test = Formatter.display('number', source, '#,##0.00');
      expect(test, result);
      test = Formatter.internal('number', test, '#,##0.00');
      expect(test, source);
    });
  });

  test("Date load", () {
    var source = '2015-10-23';
    var result = '23-10-2015';
    var test = Formatter.display('datetime', source, 'd-M-y');
    expect(test, result);
    test = Formatter.internal('datetime', test, 'd-M-y');
    expect(DateTime.parse(test), DateTime.parse(source));
  });

  test("Time load", () {
    var source = '2015-10-23 01:12:13';
    var result = '01:12:13';
    var test = Formatter.display('datetime', source, 'hh:mm:ss');
    expect(test, result);
    test = Formatter.internal('datetime', test, 'hh:mm:ss');
    expect(test, '1970-01-01 ${result}.000');
  });

  test("Datetime load", () {
    var source = '2015-10-23 01:12:13';
    var result = '23-10-2015 01:12';
    var test = Formatter.display('datetime', source, 'd-M-y hh:mm');
    expect(test, result);
    test = Formatter.internal('datetime', test, 'd-M-y hh:mm');
    expect(test, '2015-10-23 01:12:00.000');
  });

  test("Casenumber load", () {
    var source = '20110010';
    var result = '10/2011';
    var test = Formatter.display('casenumber', source);
    expect(test, result);
    test = Formatter.internal('casenumber', test);
    expect(test, source);
  });
}