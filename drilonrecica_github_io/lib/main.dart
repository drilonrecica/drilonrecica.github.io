import 'package:drilonrecica_github_io/responsive_layout.dart';
import 'package:drilonrecica_github_io/main_large_child.dart';
import 'package:drilonrecica_github_io/main_medium_child.dart';
import 'package:drilonrecica_github_io/main_small_child.dart';
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Drilon Reçica',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Android Magician'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ResponsiveLayout(
        largeChild: LargeBody(),
        mediumChild: MediumBody(),
        smallChild: SmallBody(),
      ),
    );
  }
}
