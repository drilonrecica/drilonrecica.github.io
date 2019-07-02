import 'package:drilonrecica/main_medium_child.dart';
import 'package:flutter_web/material.dart';
import 'responsive.dart';
import 'package:drilonrecica/main_small_child.dart';
import 'package:drilonrecica/main_large_child.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Drilon Reçica',
      theme: ThemeData(
        primarySwatch: Colors.black87,
      ),
      home: MyHomePage(title: 'Developer by Work-Nerd by Passion'),
    );
  }
}

class MyHomePage extends StatelessWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: ResponsiveLayout(
      largeChild: LargeBody(),
      mediumChild: MediumBody(),
      smallChild: SmallBody(),
    ));
  }
}
