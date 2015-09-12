
var teamListItemTemplate = '\
<div class="row row-pad-md teamrow">\
  <div class="col-xs-2"><h5 class="teamrow-name"></h5></div>\
  <div class="col-xs-5">\
    <input type="text" class="form-control" placeholder="Name" >\
  </div>\
  <div class="col-xs-4">\
    <input type="text" class="form-control" placeholder="Name" >\
  </div>\
  <div class="col-xs-1">\
    <button class="btn btn-danger" onclick="teamsPage.onRemoveTeamButtonClick(this)">X</button>\
  </div>\
</div>';

var bridgeConfig = {
    teams : {},
    teamCount : 0,
    teamIs : function( id, name1, name2 ) {
        if( this.teams[ id ] == undefined ) {
            this.teamCount++;
        }
        this.teams[ id ] = { p1: name1, p2: name2 };
    },
    teamDel : function( id ) {
        if( this.teams[ id ] != undefined ) {
            this.teamCount--;
        }
        delete this.teams[ id ];
    }
}

var appSm = {
    page : 'teams',

    pageIs : function( page ) {
        this.page = page;
        console.log( 'Page: ' + page );
        // TODO update page and breadcrumbs
    }

}

var teamsPage = {
    teamsList : $( '#teams' ),
    nextTeamIdx : 0,

    teamIs : function() {
        bridgeConfig.teamIs( this.nextTeamIdx, "", "" );
        this.addTeamRow( this.nextTeamIdx );
        this.nextTeamIdx++;
    },

    teamDel : function( id ) {
        bridgeConfig.teamDel( id );
        this.removeTeamRow( id );
    },

    addTeamRow : function( id ) {
        var teamEntry = $( $.parseHTML( teamListItemTemplate ) );
        teamEntry.attr( "data-team-id", this.nextTeamIdx );
        teamEntry.find( ".teamrow-name" ).text( "Team " + this.nextTeamIdx );
        teamsPage.teamsList.append( teamEntry );
    },

    removeTeamRow : function( id ) {
        this.teamsList.find( ".teamrow[data-team-id='" + id + "']" ).remove();
    },

    onAddTeamButtonClick : function() {
        this.teamIs();
    },

    onRemoveTeamButtonClick : function( e ) {
        e = $( e );
        var row = e.parents( ".teamrow" );
        var id = row.data( 'team-id' );
        this.teamDel( id );
    },

    onPlayButtonClick : function() {
        if( bridgeConfig.teamCount % 2 != 0 ) {
            alert( "Need an even number of teams!" );
        } else {
            appSm.pageIs( 'play' );
        }
    },

    updateTeamMemberNames : function() {

    },
}

function main() {
    teamsPage.teamIs();
}

main();
