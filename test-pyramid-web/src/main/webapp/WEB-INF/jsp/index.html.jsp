<!DOCTYPE html>
<html data-ng-app="pyramid">
<head>
  <title>Test Pyramid | Pyramids Collection</title>
  <link href="${pageContext.request.contextPath}/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="${pageContext.request.contextPath}/vendor/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet">

  <script type="text/javascript" src="${pageContext.request.contextPath}/js/vendor/angular.min.js"></script>
  <script type="text/javascript" src="${pageContext.request.contextPath}/js/app.js"></script>
  <%--<script type="text/javascript" src="${pageContext.request.contextPath}/vendor/bootstrap/js/bootstrap.min.js"></script>--%>
</head>
<body data-ng-controller="PyramidCtrl as pyramid">
<div class="content">
  <form>
    <div class="">
      <label for="project-name">Project Name</label>
      <input id="project-name">
      </div>
    <div class="">
      <label for="n-of-unit-tests">Number of Unit Tests</label>
      <input id="n-of-unit-tests" data-ng-model="pyramid.unitTests.count" data-ng-change="pyramid.updatePercentage()">
      <label id="unit-tests-label">{{pyramid.unitTests.label}}</label></div>
    <div class="">
      <label for="n-of-component-tests">Number of Component Tests</label>
      <input id="n-of-component-tests" data-ng-model="pyramid.componentTests.count" data-ng-change="pyramid.updatePercentage()">
      <label id="component-tests-label">{{pyramid.componentTests.label}}</label></div>
    <div class="">
      <label for="n-of-system-tests">Number of System Tests</label>
      <input id="n-of-system-tests" data-ng-model="pyramid.systemTests.count" data-ng-change="pyramid.updatePercentage()">
      <label id="system-tests-label">{{pyramid.systemTests.label}}</label></div>
    <div>
      <button id="save-btn" class="btn-primary">Save</button>
    </div>
  </form>
</div>
</body>
</html>
